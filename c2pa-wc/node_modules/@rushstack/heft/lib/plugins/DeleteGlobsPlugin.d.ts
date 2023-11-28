import { HeftEventPluginBase } from '../pluginFramework/HeftEventPluginBase';
import { ScopedLogger } from '../pluginFramework/logging/ScopedLogger';
import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { IHeftEventActions, HeftEvent, IHeftConfigurationDeleteGlobsEventAction } from '../utilities/CoreConfigFiles';
import { ICleanStageProperties } from '../stages/CleanStage';
import { IBuildStageProperties } from '../stages/BuildStage';
export declare class DeleteGlobsPlugin extends HeftEventPluginBase<IHeftConfigurationDeleteGlobsEventAction> {
    readonly pluginName: string;
    protected eventActionName: keyof IHeftEventActions;
    protected loggerName: string;
    /**
     * @override
     */
    protected handleCleanEventActionsAsync(heftEvent: HeftEvent, heftEventActions: IHeftConfigurationDeleteGlobsEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: ICleanStageProperties): Promise<void>;
    /**
     * @override
     */
    protected handleBuildEventActionsAsync(heftEvent: HeftEvent, heftEventActions: IHeftConfigurationDeleteGlobsEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: IBuildStageProperties): Promise<void>;
    private _runDeleteForHeftEventActions;
    private _resolvePathAsync;
}
//# sourceMappingURL=DeleteGlobsPlugin.d.ts.map