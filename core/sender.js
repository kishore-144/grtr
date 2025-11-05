import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import chalk from "chalk";
import { getNicknameIP } from "./nickname.js";
import archiver from "archiver";

export async function sendFile(nickname, targetPath) {
  const ip = getNicknameIP(nickname);
  if (!ip) {
    console.log(chalk.red(`Nickname '${nickname}' not found.`));
    return;
  }

  const stat = fs.statSync(targetPath);
  let fileToSend = targetPath;
  if (stat.isDirectory()) {
    const zipPath = `${targetPath}.zip`;
    await zipFolder(targetPath, zipPath);
    fileToSend = zipPath;
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(fileToSend));

  console.log(chalk.yellow(`Sending ${path.basename(fileToSend)} to ${nickname} (${ip})...`));

  try {
    await axios.post(`http://${ip}:5050/upload`, form, { headers: form.getHeaders() });
    console.log(chalk.green("Transfer complete!"));
  } catch (err) {
    console.error(chalk.red("Error sending file:"), err.message);
  }
}

function zipFolder(src, dest) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));
    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();
  });
}
