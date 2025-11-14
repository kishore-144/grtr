// index.test.js
import * as index from "../src/index.js";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock exports
describe("index.js, Exports", () => {
    it("should re-export all core modules", () => {
        expect(index.startServer).toBeTypeOf("function");
        expect(index.sendFile).toBeTypeOf("function");
        expect(index.receiveFile).toBeTypeOf("function");
        expect(index.setMode).toBeTypeOf("function");
        expect(index.getMode).toBeTypeOf("function");
        expect(index.setAPI).toBeTypeOf("function");
        expect(index.getConfig).toBeTypeOf("function");
        expect(index.registerNickname).toBeTypeOf("function");
        expect(index.getNicknameIP).toBeTypeOf("function");
    });
});

// Entry point
describe("index.js CLI help", () => {
    const ARGV = process.argv;

    // Reset modules before tests
    beforeEach(() => {
        vi.resetModules();
    });

    // Restore ARGV after tests
    afterEach(() => {
        vi.restoreAllMocks();
        process.argv = ARGV;
    });

    // Test Case: 1
    it("prints help when called directly", async () => {
        // Set mock data, mock method
        process.argv = ["/usr/bin/node", "/mock/index.js"];
        const consoleSpy = vi
            .spyOn(console, "log")
            .mockImplementation(() => { });

        await import("../src/index.js");

        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy.mock.calls[0][0]).toContain("grtr");
    });

    // Test Case: 2
    it("does not print help when called with a wrong path", async () => {
        // Set mock data, mock method
        process.argv = ["/usr/bin/node", "/mock/main.js"];
        const consoleSpy = vi
            .spyOn(console, "log")
            .mockImplementation(() => { });

        await import("../src/index.js");

        expect(consoleSpy).not.toHaveBeenCalled();
    });
});
