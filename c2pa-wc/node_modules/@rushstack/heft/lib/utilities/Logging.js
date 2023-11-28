"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
const perf_hooks_1 = require("perf_hooks");
const DEFAULT_FINISHED_WORDS = {
    success: 'finished',
    failure: 'encountered an error'
};
class Logging {
    static async runFunctionWithLoggingBoundsAsync(terminal, name, fn, finishedWords = DEFAULT_FINISHED_WORDS) {
        terminal.writeLine(` ---- ${name} started ---- `);
        const startTime = perf_hooks_1.performance.now();
        let finishedLoggingWord = finishedWords.success;
        try {
            await fn();
        }
        catch (e) {
            finishedLoggingWord = finishedWords.failure;
            throw e;
        }
        finally {
            const executionTime = Math.round(perf_hooks_1.performance.now() - startTime);
            terminal.writeLine(` ---- ${name} ${finishedLoggingWord} (${executionTime}ms) ---- `);
        }
    }
}
exports.Logging = Logging;
//# sourceMappingURL=Logging.js.map