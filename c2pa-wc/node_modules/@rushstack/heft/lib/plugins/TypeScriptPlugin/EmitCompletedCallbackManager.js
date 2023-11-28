"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmitCompletedCallbackManager = void 0;
const SubprocessCommunicationManagerBase_1 = require("../../utilities/subprocess/SubprocessCommunicationManagerBase");
const EMIT_COMPLETED_CALLBACK_MANAGER_MESSAGE = 'emitCompletedCallbackManagerMessage';
class EmitCompletedCallbackManager extends SubprocessCommunicationManagerBase_1.SubprocessCommunicationManagerBase {
    constructor(callback) {
        super();
        this._callback = callback;
    }
    callback() {
        this.sendMessageToParentProcess({ type: EMIT_COMPLETED_CALLBACK_MANAGER_MESSAGE });
    }
    canHandleMessageFromSubprocess(message) {
        return message.type === EMIT_COMPLETED_CALLBACK_MANAGER_MESSAGE;
    }
    receiveMessageFromSubprocess(message) {
        if (message.type === EMIT_COMPLETED_CALLBACK_MANAGER_MESSAGE) {
            this._callback();
        }
    }
    canHandleMessageFromParentProcess(message) {
        return false;
    }
    receiveMessageFromParentProcess(message) { }
}
exports.EmitCompletedCallbackManager = EmitCompletedCallbackManager;
//# sourceMappingURL=EmitCompletedCallbackManager.js.map