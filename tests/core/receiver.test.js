import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { receiveFile } from "../../src/core/receiver";

describe("receiveFile", () => {
    let consoleLog;

    beforeEach(() => {
        consoleLog = vi.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should log the messages with correct chalk formatting", () => {
        const nickname = "John Doe";

        receiveFile(nickname);

        expect(consoleLog).toHaveBeenCalledTimes(2);
        expect(consoleLog).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining(nickname)
        );
        expect(consoleLog).toHaveBeenNthCalledWith(
            2,
            expect.stringMatching(/grtr|transfers/)
        );
    });
});
