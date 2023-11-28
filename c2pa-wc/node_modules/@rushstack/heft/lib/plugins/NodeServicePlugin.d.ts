import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { IHeftPlugin } from '../pluginFramework/IHeftPlugin';
export interface INodeServicePluginCompleteConfiguration {
    commandName: string;
    ignoreMissingScript: boolean;
    waitBeforeRestartMs: number;
    waitForTerminateMs: number;
    waitForKillMs: number;
}
export interface INodeServicePluginConfiguration extends Partial<INodeServicePluginCompleteConfiguration> {
}
export declare class NodeServicePlugin implements IHeftPlugin {
    readonly pluginName: string;
    private static readonly _isWindows;
    private _logger;
    private _activeChildProcess;
    private _state;
    /**
     * The state machine schedules at most one setInterval() timeout at any given time.  It is for:
     *
     * - waitBeforeRestartMs in State.Stopped
     * - waitForTerminateMs in State.Stopping
     * - waitForKillMs in State.Killing
     */
    private _timeout;
    /**
     * Used by _scheduleRestart().  The process will be automatically restarted when performance.now()
     * exceeds this time.
     */
    private _restartTime;
    /**
     * The data read from the node-service.json config file, or "undefined" if the file is missing.
     */
    private _rawConfiguration;
    /**
     * The effective configuration, with defaults applied.
     */
    private _configuration;
    /**
     * The script body obtained from the "scripts" section in the project's package.json.
     */
    private _shellCommand;
    /**
     * This is set to true when the child process terminates unexpectedly (for example, something like
     * "the service listening port is already in use" or "unable to authenticate to the database").
     * Rather than attempting to restart in a potentially endless loop, instead we will wait until "watch mode"
     * recompiles the project.
     */
    private _childProcessFailed;
    private _pluginEnabled;
    apply(heftSession: HeftSession, heftConfiguration: HeftConfiguration): void;
    private _loadStageConfiguration;
    private _runCommandAsync;
    private _compileHooks_afterEachCompile;
    private _restartChild;
    private _formatCodeOrSignal;
    private _stopChild;
    private _transitionToKilling;
    private _transitionToStopped;
    private _scheduleRestart;
    private _clearTimeout;
    private _trapUnhandledException;
}
//# sourceMappingURL=NodeServicePlugin.d.ts.map