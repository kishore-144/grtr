
import { Command } from "commander";
import chalk from "chalk";
import { setMode, getMode } from "./core/config.js";
import { startServer } from "./core/server.js";
import { sendFile } from "./core/sender.js";
import { receiveFile } from "./core/receiver.js";
import { registerNickname, getNicknameIP } from "./core/nickname.js";

const program = new Command();
program
  .name("grtr")
  .description("Instant file/folder transfer CLI using nicknames")
  .version("1.0.0");

program
  .command("serve <nickname>")
  .description("Serve your device under a nickname")
  .action((nickname) => {
    startServer(nickname);
  });


program
  .command("send <nickname> <path>")
  .description("Send file/folder to nickname")
  .action((nickname, path) => {
    sendFile(nickname, path);
  });

// Receive file
program
  .command("receive <nickname>")
  .description("Receive file/folder from nickname")
  .action((nickname) => {
    receiveFile(nickname);
  });

// Change mode
program
  .command("mode <type>")
  .description("Switch between LAN or WAN mode")
  .action((type) => {
    setMode(type);
    console.log(chalk.green(`Mode set to: ${type}`));
  });

// Register nickname manually
program
  .command("newapi <url>")
  .description("Register new relay/relay API base URL")
  .action((url) => {
    registerNickname(url);
  });

program.parse(process.argv);
