// server.test.js
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";
import { startServer } from "../../src/core/server";
import { registerNickname } from "../../src/core/nickname";

// Setup mock implementations
vi.mock("../../src/core/nickname.js", () => ({
    registerNickname: vi.fn(),
}));

describe("startServer", () => {
    let app, server, consoleLog;

    beforeAll(async () => {
        consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

        const result = startServer("prod");
        app = result.app;
        server = result.server;

        // Await until the server startup
        return new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterAll(() => {
        server.close();
    });

    it("should respond with nickname, IP on /whoami", async () => {
        const res = await request(app).get("/whoami");
        expect(res.statusCode).toBe(200);
        expect(res.body.nickname).toBe("prod");
        expect(res.body.ip).toBeDefined();
        expect(res.body.ip).not.toMatch(/^::ffff:/);
    });

    it("should handle file uploads correctly", async () => {
        const buffer = path.join(process.cwd(), "buffer.txt");
        fs.writeFileSync(buffer, "Buffer is a buffer");

        const res = await request(app).post("/upload").attach("file", buffer);

        expect(res.statusCode).toBe(200);

        const uploaded = path.join(process.cwd(), "buffer.txt");
        expect(fs.existsSync(uploaded)).toBe(true);

        fs.unlinkSync(uploaded);
    });

    it("should call registerNickname, print info when server starts", () => {
        expect(registerNickname).toHaveBeenCalledWith("prod");
        expect(consoleLog).toHaveBeenCalled();
    });
});
