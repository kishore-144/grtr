import fs from "fs";
import path from "path";
const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".grtr.json"
);

export function getConfig() {
    if (!fs.existsSync(configPath))
        return { mode: "lan", api: "https://grtr-relay.example.com" };
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function setMode(mode) {
    const cfg = getConfig();
    cfg.mode = mode;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

export function getMode() {
    return getConfig().mode;
}

export function setAPI(url) {
    const cfg = getConfig();
    cfg.api = url;
    fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}
