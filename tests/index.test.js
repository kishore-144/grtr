// index.test.js
import * as index from "../src/index.js";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
