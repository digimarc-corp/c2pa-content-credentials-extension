import { Terminal, ITerminalProvider } from '@rushstack/node-core-library';
import { IHeftPlugin } from '../IHeftPlugin';
export interface IScopedLoggerOptions {
    requestingPlugin: IHeftPlugin;
    loggerName: string;
    terminalProvider: ITerminalProvider;
    getShouldPrintStacks: () => boolean;
    errorHasBeenEmittedCallback: () => void;
}
/**
 * @public
 */
export interface IScopedLogger {
    readonly terminal: Terminal;
    /**
     * Call this function to emit an error to the heft runtime.
     */
    emitError(error: Error): void;
    /**
     * Call this function to emit an warning to the heft runtime.
     */
    emitWarning(warning: Error): void;
}
/**
 * @public
 */
export declare class ScopedLogger implements IScopedLogger {
    private readonly _options;
    private readonly _errors;
    private readonly _warnings;
    private get _shouldPrintStacks();
    get errors(): ReadonlyArray<Error>;
    get warnings(): ReadonlyArray<Error>;
    /**
     * @internal
     */
    readonly _requestingPlugin: IHeftPlugin;
    readonly loggerName: string;
    readonly terminalProvider: ITerminalProvider;
    readonly terminal: Terminal;
    /**
     * @internal
     */
    constructor(options: IScopedLoggerOptions);
    /**
     * {@inheritdoc IScopedLogger.emitError}
     */
    emitError(error: Error): void;
    /**
     * {@inheritdoc IScopedLogger.emitWarning}
     */
    emitWarning(warning: Error): void;
}
//# sourceMappingURL=ScopedLogger.d.ts.map