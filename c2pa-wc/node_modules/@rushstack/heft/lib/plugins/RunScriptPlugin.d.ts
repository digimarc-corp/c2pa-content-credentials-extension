import { HeftEventPluginBase } from '../pluginFramework/HeftEventPluginBase';
import { ScopedLogger } from '../pluginFramework/logging/ScopedLogger';
import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { IHeftEventActions, IHeftConfigurationRunScriptEventAction, HeftEvent } from '../utilities/CoreConfigFiles';
import { IBuildStageProperties } from '../stages/BuildStage';
import { ITestStageProperties } from '../stages/TestStage';
/**
 * Options provided to scripts that are run using the RunScriptPlugin.
 *
 * @beta
 */
export interface IRunScriptOptions<TStageProperties> {
    scopedLogger: ScopedLogger;
    heftConfiguration: HeftConfiguration;
    debugMode: boolean;
    properties: TStageProperties;
    scriptOptions: Record<string, any>;
}
export declare class RunScriptPlugin extends HeftEventPluginBase<IHeftConfigurationRunScriptEventAction> {
    readonly pluginName: string;
    protected readonly eventActionName: keyof IHeftEventActions;
    protected readonly loggerName: string;
    /**
     * @override
     */
    protected handleBuildEventActionsAsync(heftEvent: HeftEvent, runScriptEventActions: IHeftConfigurationRunScriptEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: IBuildStageProperties): Promise<void>;
    /**
     * @override
     */
    protected handleTestEventActionsAsync(heftEvent: HeftEvent, runScriptEventActions: IHeftConfigurationRunScriptEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: ITestStageProperties): Promise<void>;
    private _runScriptsForHeftEventActions;
}
//# sourceMappingURL=RunScriptPlugin.d.ts.map