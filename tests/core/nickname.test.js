import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { registerNickname, getNicknameIP } from "../../src/core/nickname";

const nickPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".grtr-nicknames.json"
);

describe("nickname.js", () => {
    let existsSyncMock;
    let readFileSyncMock;
    let writeFileSyncMock;
    let networkInterfacesMock;
    let consoleLogMock;

    // Declare mock implementations before each case
    beforeEach(() => {
        existsSyncMock = vi
            .spyOn(fs, "existsSync")
            .mockImplementation(() => false);
        readFileSyncMock = vi
            .spyOn(fs, "readFileSync")
            .mockImplementation(() => "{}");
        writeFileSyncMock = vi
            .spyOn(fs, "writeFileSync")
            .mockImplementation(() => {});
        networkInterfacesMock = vi
            .spyOn(os, "networkInterfaces")
            .mockReturnValue({
                eth0: [
                    {
                        family: "IPv4",
                        internal: false,
                        address: "192.168.106.69",
                    },
                ],
            });
        consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    });

    // Restore all mock implementations after each case
    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Tests for registerNickname
    // Test Case: 1
    it("registerNickname should write nickname with the appropriate IP", () => {
        registerNickname("buffer");

        expect(existsSyncMock).toHaveBeenCalledWith(nickPath);
        expect(writeFileSyncMock).toHaveBeenCalledWith(
            nickPath,
            JSON.stringify({ buffer: "192.168.106.69" }, null, 2)
        );
        expect(consoleLogMock).toHaveBeenCalledWith(
            "Registered nickname buffer at 192.168.106.69"
        );
    });

    // Test Case: 2
    it("registerNickname should add another entry even for the same IP", () => {
        existsSyncMock.mockReturnValue(true);
        readFileSyncMock.mockReturnValue(
            JSON.stringify({ buffer: "192.168.106.69" })
        );

        registerNickname("prod");
        expect(consoleLogMock).toHaveBeenCalledWith(
            "Registered nickname prod at 192.168.106.69"
        );

        const result = JSON.parse(writeFileSyncMock.mock.calls[0][1]);
        expect(result).toEqual({
            buffer: "192.168.106.69",
            prod: "192.168.106.69",
        });
    });

    // Test Case: 3
    it("registerNickname should rewrite the IP if the same nickname is given", () => {
        existsSyncMock.mockReturnValue(true);
        readFileSyncMock.mockReturnValue(
            JSON.stringify({ buffer: "192.168.106.69" })
        );

        registerNickname("buffer");
        expect(consoleLogMock).toHaveBeenCalledWith(
            "Registered nickname buffer at 192.168.106.69"
        );

        const result = JSON.parse(writeFileSyncMock.mock.calls[0][1]);
        expect(result).toEqual({
            buffer: "192.168.106.69",
        });
    });

    // Tests for getNicknameIP
    // Test Case: 1
    it("getNicknameIP returns null because the file does not exist", () => {
        existsSyncMock.mockReturnValue(false);

        const ip = getNicknameIP("buffer");
        expect(ip).toBeNull();
    });

    // Test Case: 2
    it("getNicknameIP returns IP for existing nickname", () => {
        existsSyncMock.mockReturnValue(true);
        readFileSyncMock.mockReturnValue(
            JSON.stringify({ prod: "192.168.69.106" })
        );

        const ip = getNicknameIP("prod");
        expect(ip).toBe("192.168.69.106");
    });

    // Test Case: 3
    it("getNicknameIP returns null for nicknames that does not exist", () => {
        existsSyncMock.mockReturnValue(true);
        readFileSyncMock.mockReturnValue(
            JSON.stringify({ prod: "192.168.69.106" })
        );

        const ip = getNicknameIP("buffer");
        expect(ip).toBe(null);
    });
});
