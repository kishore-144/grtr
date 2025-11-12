import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import chalk from "chalk";
import { receiveFile } from "../../src/core/receiver";

describe("receiveFile", () => {
    let consoleLog;

    beforeEach(() => {
        consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should log the messages with correct chalk formatting", () => {
        const nickname = "John Doe";

        receiveFile(nickname);
        const expectedFirstLine = chalk.green(
            `Listening for files from '${nickname}'...`
        );
        const expectedSecondLine = chalk.gray(
            "Run `grtr serve <yourname>` on this device to accept transfers."
        );

        expect(consoleLog).toHaveBeenCalledTimes(2);
        expect(consoleLog).toHaveBeenNthCalledWith(1, expectedFirstLine);
        expect(consoleLog).toHaveBeenNthCalledWith(2, expectedSecondLine);
    });
});
