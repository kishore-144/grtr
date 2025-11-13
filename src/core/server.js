import express from "express";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import multer from "multer";
import { registerNickname } from "./nickname.js";

export function startServer(nickname) {
    const upload = multer({ dest: "grtr_uploads/" });
    const app = express();
    const port = 5050;

    // File upload handler
    app.post("/upload", upload.single("file"), (req, res) => {
        const file = req.file;
        const dest = path.join(process.cwd(), file.originalname);
        fs.renameSync(file.path, dest);
        console.log(chalk.green(`✅ Received: ${file.originalname}`));
        res.send("File received successfully");
    });

    // Local discovery endpoint
    app.get("/whoami", (req, res) => {
        // Get the sender-visible IP address
        const remoteIp =
            req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Clean IPv6-mapped addresses like "::ffff:192.168.1.5"
        const cleanIp = remoteIp.replace(/^::ffff:/, "");

        res.json({
            nickname,
            ip: cleanIp,
        });
    });

    const server = app.listen(port, "0.0.0.0", () => {
        registerNickname(nickname);
        console.log(chalk.cyan(`🌐 Serving as '${nickname}' on port ${port}`));
    });

    return { app, server };
}
