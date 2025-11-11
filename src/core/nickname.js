import os from "os";
import fs from "fs";
import path from "path";
import { getConfig } from "./config.js";

const nickPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".grtr-nicknames.json"
);

export function registerNickname(nickname) {
    const network = Object.values(os.networkInterfaces())
        .flat()
        .find((iface) => iface.family === "IPv4" && !iface.internal);
    const ip = network?.address;
    let nicks = {};
    if (fs.existsSync(nickPath)) nicks = JSON.parse(fs.readFileSync(nickPath));
    nicks[nickname] = ip;
    fs.writeFileSync(nickPath, JSON.stringify(nicks, null, 2));
    console.log(`Registered nickname ${nickname} at ${ip}`);
}

export function getNicknameIP(nickname) {
    if (!fs.existsSync(nickPath)) return null;
    const nicks = JSON.parse(fs.readFileSync(nickPath));
    return nicks[nickname] || null;
}
