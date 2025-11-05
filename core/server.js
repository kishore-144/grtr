import express from "express";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const multer = require("multer");

import { registerNickname } from "./nickname.js";


export function startServer(nickname) {
  const upload = multer({ dest: "grtr_uploads/" });
  const app = express();
  const port = 5050;

  app.post("/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    const dest = path.join(process.cwd(), file.originalname);
    fs.renameSync(file.path, dest);
    console.log(chalk.green(`Received: ${file.originalname}`));
    res.send("File received successfully");
  });

  app.listen(port, () => {
    registerNickname(nickname);
    console.log(chalk.cyan(`Serving as '${nickname}' on port ${port}`));
  });
}
