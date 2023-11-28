"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefixProxyTerminalProvider = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
class PrefixProxyTerminalProvider {
    constructor(parent, prefix) {
        this._parent = parent;
        this._prefix = prefix;
    }
    static getTerminal(parent, prefix) {
        const provider = new PrefixProxyTerminalProvider(parent, prefix);
        return new node_core_library_1.Terminal(provider);
    }
    get supportsColor() {
        return this._parent.supportsColor;
    }
    get eolCharacter() {
        return this._parent.eolCharacter;
    }
    write(data, severity) {
        this._parent.write(this._prefix + data, severity);
    }
}
exports.PrefixProxyTerminalProvider = PrefixProxyTerminalProvider;
//# sourceMappingURL=PrefixProxyTerminalProvider.js.map