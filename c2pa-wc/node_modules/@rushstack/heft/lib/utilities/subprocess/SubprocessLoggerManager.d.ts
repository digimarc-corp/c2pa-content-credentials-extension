import { ISubprocessMessageBase } from './SubprocessCommunication';
import { SubprocessCommunicationManagerBase } from './SubprocessCommunicationManagerBase';
import { TerminalProviderManager } from './TerminalProviderManager';
import { IScopedLogger } from '../../pluginFramework/logging/ScopedLogger';
import { HeftSession } from '../../pluginFramework/HeftSession';
export interface ISubprocessLoggerManagerOptions {
    terminalProviderManager: TerminalProviderManager;
    heftSession?: HeftSession;
}
export declare class SubprocessLoggerManager extends SubprocessCommunicationManagerBase {
    private readonly _terminalProviderManager;
    private readonly _heftSession;
    private readonly _loggerNamesAwaitingResponse;
    private readonly _requestedLoggers;
    constructor(options: ISubprocessLoggerManagerOptions);
    requestScopedLoggerAsync(loggerName: string): Promise<IScopedLogger>;
    canHandleMessageFromSubprocess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromSubprocess(message: ISubprocessMessageBase): void;
    canHandleMessageFromParentProcess(message: ISubprocessMessageBase): boolean;
    receiveMessageFromParentProcess(message: ISubprocessMessageBase): void;
}
//# sourceMappingURL=SubprocessLoggerManager.d.ts.map