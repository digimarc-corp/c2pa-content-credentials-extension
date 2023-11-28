"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedLogger = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
const PrefixProxyTerminalProvider_1 = require("../../utilities/PrefixProxyTerminalProvider");
const LoggingManager_1 = require("./LoggingManager");
/**
 * @public
 */
class ScopedLogger {
    /**
     * @internal
     */
    constructor(options) {
        this._errors = [];
        this._warnings = [];
        this._options = options;
        this._requestingPlugin = options.requestingPlugin;
        this.loggerName = options.loggerName;
        this.terminalProvider = new PrefixProxyTerminalProvider_1.PrefixProxyTerminalProvider(options.terminalProvider, `[${this.loggerName}] `);
        this.terminal = new node_core_library_1.Terminal(this.terminalProvider);
    }
    get _shouldPrintStacks() {
        return this._options.getShouldPrintStacks();
    }
    get errors() {
        return [...this._errors];
    }
    get warnings() {
        return [...this._warnings];
    }
    /**
     * {@inheritdoc IScopedLogger.emitError}
     */
    emitError(error) {
        this._errors.push(error);
        this.terminal.writeErrorLine(`Error: ${LoggingManager_1.LoggingManager.getErrorMessage(error)}`);
        if (this._shouldPrintStacks && error.stack) {
            this.terminal.writeErrorLine(error.stack);
        }
    }
    /**
     * {@inheritdoc IScopedLogger.emitWarning}
     */
    emitWarning(warning) {
        this._warnings.push(warning);
        this.terminal.writeWarningLine(`Warning: ${LoggingManager_1.LoggingManager.getErrorMessage(warning)}`);
        if (this._shouldPrintStacks && warning.stack) {
            this.terminal.writeWarningLine(warning.stack);
        }
    }
}
exports.ScopedLogger = ScopedLogger;
//# sourceMappingURL=ScopedLogger.js.map