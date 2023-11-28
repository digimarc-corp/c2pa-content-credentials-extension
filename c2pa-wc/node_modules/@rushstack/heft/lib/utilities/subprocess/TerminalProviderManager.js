"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalProviderManager = void 0;
const SubprocessCommunicationManagerBase_1 = require("./SubprocessCommunicationManagerBase");
const TERMINAL_PROVIDER_MESSAGE_TYPE = 'terminalProviderMessage';
class TerminalProviderManager extends SubprocessCommunicationManagerBase_1.SubprocessCommunicationManagerBase {
    constructor(options) {
        super();
        this._terminalProviderIdCounter = 0;
        this._terminalProviders = new Map();
        this._configuration = options.configuration;
    }
    registerTerminalProvider(terminalProvider) {
        const id = this._terminalProviderIdCounter++;
        this._terminalProviders.set(id, terminalProvider);
        return id;
    }
    registerSubprocessTerminalProvider(terminalProviderId) {
        const terminalProvider = {
            eolCharacter: this._configuration.terminalEolCharacter,
            supportsColor: this._configuration.terminalSupportsColor,
            write: (data, severity) => {
                const message = {
                    type: TERMINAL_PROVIDER_MESSAGE_TYPE,
                    terminalProviderId,
                    data,
                    severity
                };
                this.sendMessageToParentProcess(message);
            }
        };
        return terminalProvider;
    }
    canHandleMessageFromSubprocess(message) {
        return message.type === TERMINAL_PROVIDER_MESSAGE_TYPE;
    }
    receiveMessageFromSubprocess(message) {
        if (message.type === TERMINAL_PROVIDER_MESSAGE_TYPE) {
            const { terminalProviderId, data, severity } = message;
            const terminalProvider = this._terminalProviders.get(terminalProviderId);
            if (terminalProvider) {
                terminalProvider.write(data, severity);
            }
            else {
                throw new Error(`A terminal provider with ID ${terminalProviderId} has not been registered.`);
            }
        }
    }
    canHandleMessageFromParentProcess(message) {
        return false;
    }
    receiveMessageFromParentProcess(message) { }
}
exports.TerminalProviderManager = TerminalProviderManager;
//# sourceMappingURL=TerminalProviderManager.js.map