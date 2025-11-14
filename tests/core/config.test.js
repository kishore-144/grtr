// config.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

let configModule;
let mockConfigPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    ".grtr.json"
);

beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Create mocks
    vi.mock("fs", () => {
        const existsSync = vi.fn();
        const readFileSync = vi.fn();
        const writeFileSync = vi.fn();

        return {
            existsSync,
            readFileSync,
            writeFileSync,
            default: { existsSync, readFileSync, writeFileSync },
        };
    });

    configModule = await import("../../src/core/config.js");
});

// Mocks getConfig
describe("getConfig()", () => {
    // Test Case: 1
    it("returns defaults if config doesn't exist", () => {
        // Set existence of the file to null
        fs.existsSync.mockReturnValue(false);
        const result = configModule.getConfig();

        expect(result).toEqual({
            mode: "lan",
            api: "https://grtr-relay.example.com",
        });
    });

    // Test Case: 2
    it("returns and parses existing config", () => {
        // Set a existing config
        const fakeConfig = { mode: "wan", api: "https://example.com" };
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(fakeConfig));
        const result = configModule.getConfig();

        expect(result).toEqual(fakeConfig);
    });
});

// Mocks setMode
describe("setMode()", () => {
    it("updates mode and writes the config", () => {
        const fakeConfig = { mode: "wan", api: "https://example.com" };
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(fakeConfig));

        configModule.setMode("wan");

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            mockConfigPath,
            JSON.stringify({ mode: "wan", api: "https://example.com" }, null, 2)
        );
    });
});

// Mocks getMode
describe("getMode()", () => {
    it("returns mode from the config", () => {
        const fakeConfig = { mode: "lan", api: "https://example.com" };
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(fakeConfig));

        const result = configModule.getMode();

        expect(result).toBe("lan");
    });
});

// Mocks setAPI
describe("setAPI()", () => {
    it("updates api and writes the config", () => {
        const fakeConfig = { mode: "wan", api: "https://example.com" };
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify(fakeConfig));

        configModule.setAPI("https://example.org");

        expect(fs.writeFileSync).toHaveBeenCalledWith(
            mockConfigPath,
            JSON.stringify({ mode: "wan", api: "https://example.org" }, null, 2)
        );
    });
});
