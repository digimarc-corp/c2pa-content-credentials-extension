"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubprocessTerminalProvider = void 0;
class SubprocessTerminalProvider {
    constructor(builderConfiguration, writeFn) {
        if (!process.send) {
            throw new Error(`The process.send function is not supported in this context`);
        }
        this._builderConfiguration = builderConfiguration;
        this.write = writeFn;
    }
    get supportsColor() {
        return this._builderConfiguration.terminalSupportsColor;
    }
    get eolCharacter() {
        return this._builderConfiguration.terminalEolCharacter;
    }
}
exports.SubprocessTerminalProvider = SubprocessTerminalProvider;
//# sourceMappingURL=SubprocessTerminalProvider.js.map