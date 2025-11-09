// index.js
// Core internal exports for grtr CLI and programmatic usage

import { startServer } from "./core/server.js";
import { sendFile } from "./core/sender.js";
import { receiveFile } from "./core/receiver.js";
import { setMode, getMode, setAPI, getConfig } from "./core/config.js";
import { registerNickname, getNicknameIP } from "./core/nickname.js";

// Export key functions for external use
export {
    startServer,
    sendFile,
    receiveFile,
    setMode,
    getMode,
    setAPI,
    getConfig,
    registerNickname,
    getNicknameIP,
};

if (process.argv[1].endsWith("index.js")) {
    console.log(`
grtr - Quick file/folder transfer tool
--------------------------------------
Commands:
  grtr serve <nickname>       Start a local server for receiving files
  grtr send <nickname> <path> Send file/folder to a nickname
  grtr receive <nickname>     Prepare to receive a file
  grtr mode <lan|wan>         Switch between LAN or WAN mode
  grtr newapi <url>           Set or update relay API base URL

Example:
  grtr serve laptop
  grtr send laptop ./Documents/report.pdf
  `);
}
