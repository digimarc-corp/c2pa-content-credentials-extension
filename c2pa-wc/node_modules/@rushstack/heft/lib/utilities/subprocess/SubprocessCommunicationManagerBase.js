"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubprocessCommunicationManagerBase = void 0;
class SubprocessCommunicationManagerBase {
    get sendMessageToParentProcess() {
        return this._sendMessageToParentProcess;
    }
    get sendMessageToSubprocess() {
        return this._sendMessageToSubprocess;
    }
    initialize(options) {
        this._sendMessageToParentProcess = options.sendMessageToParentProcess;
        this._sendMessageToSubprocess = options.sendMessageToSubprocess;
    }
    registerSubprocess(subprocess) {
        this._sendMessageToSubprocess = subprocess.send.bind(subprocess);
    }
}
exports.SubprocessCommunicationManagerBase = SubprocessCommunicationManagerBase;
//# sourceMappingURL=SubprocessCommunicationManagerBase.js.map