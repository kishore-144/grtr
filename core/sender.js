// network-transfer.js
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import chalk from "chalk";
import { getNicknameIP } from "./nickname.js";
import archiver from "archiver";
import os from "os";

/**
 * Public: sendFile
 * - nickname: device nickname to resolve on network
 * - targetPath: file or folder path to send
 * - medium: "lan" | "wifi" | "wan" (optional)
 */
export async function sendFile(nickname, targetPath, medium) {
  if (!fs.existsSync(targetPath)) {
    console.log(chalk.redBright(`✖ The specified path does not exist: ${targetPath}`));
    console.log(chalk.gray("Please provide a valid file or folder path."));
    return;
  }

  let ip = getNicknameIP(nickname);

  if (!ip) {
    console.log(chalk.cyan(`🔍 Searching for '${nickname}' on local network...`));
    ip = await discoverDevice(nickname, medium);
    if (!ip) {
      console.log(chalk.redBright(`✖ Could not locate '${nickname}' on your network.`));
      return;
    }
  }

  const stat = fs.statSync(targetPath);
  let fileToSend = targetPath;

  if (stat.isDirectory()) {
    const zipPath = `${targetPath}.zip`;
    console.log(chalk.gray(`📦 Compressing folder before transfer...`));
    try {
      await zipFolder(targetPath, zipPath);
      fileToSend = zipPath;
    } catch (err) {
      console.log(chalk.redBright("✖ Compression failed: ") + chalk.gray(err.message));
      return;
    }
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(fileToSend));

  console.log(chalk.yellow(`📤 Transferring '${path.basename(fileToSend)}' to ${nickname} (${ip})...`));

  try {
    await axios.post(`http://${ip}:5050/upload`, form, {
      headers: form.getHeaders(),
      timeout: 1000000,
    });
    console.log(chalk.greenBright("✅ Transfer completed successfully!"));
  } catch (err) {
    console.log(chalk.redBright("✖ Transfer failed: ") + chalk.gray(err.message));
  } finally {
    // clean up temp zip if we created one
    if (stat.isDirectory() && fileToSend.endsWith(".zip")) {
      try { fs.unlinkSync(fileToSend); } catch {}
    }
  }
}

/* ---------------------------------------------------------------------------
   discoverDevice
   - Scans all physical IPv4 subnets concurrently with a controlled concurrency limit.
   - Excludes common virtual adapters (Hyper-V, WSL, Docker, VMware, loopback).
   - Short-circuits on first matching nickname.
   --------------------------------------------------------------------------- */

export async function discoverDevice(nickname, medium) {
  const interfaces = os.networkInterfaces();

  console.log(chalk.gray("🔧 Gathering network interfaces..."));

  // Pattern to exclude known virtual/irrelevant adapters on Windows and other OSes
  const virtualPattern = /(vEthernet|virtual|hyper-v|wsl|docker|vmware|loopback|tunnel|isatap|pontoon)/i;

  // Build candidate interface list
  let candidates = Object.entries(interfaces)
    .flatMap(([name, addrs]) =>
      (addrs || []).map(addr => ({ name, addr }))
    )
    .filter(({ name, addr }) =>
      addr &&
      addr.family === "IPv4" &&
      !addr.internal &&
      // if medium is "lan" prefer LAN-like names; otherwise accept wifi/wlan too.
      (!virtualPattern.test(name))
    );

  // If filtering removed everything (common on some setups), fall back to any non-internal IPv4
  if (candidates.length === 0) {
    candidates = Object.entries(interfaces)
      .flatMap(([name, addrs]) => (addrs || []).map(addr => ({ name, addr })))
      .filter(({ addr }) => addr && addr.family === "IPv4" && !addr.internal);
  }

  // Extract unique subnets (first 3 octets). Example: 192.168.1
  const subnets = [...new Set(
    candidates
      .map(c => c.addr.address ? c.addr.address.split(".").slice(0, 3).join(".") : null)
      .filter(Boolean)
  )];

  if (subnets.length === 0) {
    console.log(chalk.redBright("✖ No valid network interface found."));
    return null;
  }

  console.log(chalk.cyan(`🔎 Will scan subnets: ${subnets.join(", ")}`));

  // CONFIG: tune these values to balance speed vs resource usage
  const CONCURRENCY = 120;   // max simultaneous requests across all subnets
  const TIMEOUT = 250;       // ms per request
  const PROGRESS_DOT_EVERY = 50; // print a dot every N checks

  // Build flattened queue of IPs to scan across all subnets
  const queue = [];
  for (const subnet of subnets) {
    for (let i = 1; i <= 255; i++) {
      // Optionally skip .255 or .0 if you want; using 1..255 is fine for typical devices
      queue.push(`${subnet}.${i}`);
    }
  }

  console.log(chalk.gray(`🔎 Scanning ${queue.length} addresses with concurrency ${CONCURRENCY}...`));

  let foundIP = null;
  let aborted = false;
  let progressCounter = 0;

  // Helper to scan a single IP for /whoami
  const scanIp = async (ip) => {
    if (aborted) return null;
    try {
      const resp = await axios.get(`http://${ip}:5050/whoami`, { timeout: TIMEOUT });
      if (resp && resp.data && resp.data.nickname === nickname) {
        foundIP = ip;
        aborted = true;
        console.log(chalk.greenBright(`\n✅ Device '${nickname}' found at ${ip}`));
        return ip;
      }
    } catch {
      // ignore timeouts/failures silently (they're expected)
    } finally {
      progressCounter++;
      if (progressCounter % PROGRESS_DOT_EVERY === 0) process.stdout.write(chalk.gray("."));
    }
    return null;
  };

  // Worker pool — CONCURRENCY workers consuming the queue
  const workers = new Array(CONCURRENCY).fill(null).map(async () => {
    while (!aborted) {
      const ip = queue.shift();
      if (!ip) break;
      // scan and allow other workers to proceed even if it takes TIMEOUT
      // no await throttle here; worker loop ensures concurrency limit
      await scanIp(ip);
    }
  });

  // Wait for the workers to finish (or abort early)
  await Promise.all(workers);

  if (!foundIP) {
    console.log("\n" + chalk.redBright(`✖ No response from devices on scanned subnets.`));
    return null;
  }

  return foundIP;
}

/* ---------------------------------------------------------------------------
   zipFolder helper
   --------------------------------------------------------------------------- */
function zipFolder(src, dest) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("end", () => resolve());
    archive.on("warning", (err) => {
      if (err.code === "ENOENT") console.log(chalk.yellow("⚠ Archive warning:"), err.message);
      else reject(err);
    });
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();
  });
}
