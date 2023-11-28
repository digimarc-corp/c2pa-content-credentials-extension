import { ITerminalProvider } from '@rushstack/node-core-library';
import { ISubprocessInnerConfiguration } from './SubprocessRunnerBase';
import { ISubprocessMessageBase } from './SubprocessCommunication';
import { SubprocessCommunicationManagerBase } from './SubprocessCommunicationManagerBase';
export interface ITerminalProviderManagerOptions {
    configuration: ISubprocessInnerConfiguration;
}
export declare class TerminalProviderManager extends SubprocessCommunicationManagerBase {
    private _terminalProviderIdCounter;
    private readonly _terminalProviders;
    private readonly _configuration;
    constructor(options: ITerminalProviderManagerOptions);
    registerTerminalProvider(terminalProvider: ITerminalProvider): number;
    registerSubprocessTerminalProvider(terminalProviderId: number): ITerminalProvider;
    canHandleMessageFromSubprocess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromSubprocess(message: ISubprocessMessageBase): void;
    canHandleMessageFromParentProcess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromParentProcess(message: ISubprocessMessageBase): void;
}
//# sourceMappingURL=TerminalProviderManager.d.ts.map