import { IHeftPlugin } from '../pluginFramework/IHeftPlugin';
import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { ScopedLogger } from '../pluginFramework/logging/ScopedLogger';
import { HeftEvent, IHeftConfigurationJsonEventActionBase, IHeftEventActions } from '../utilities/CoreConfigFiles';
import { ICleanStageProperties } from '../stages/CleanStage';
import { IBuildStageProperties } from '../stages/BuildStage';
import { ITestStageProperties } from '../stages/TestStage';
export declare abstract class HeftEventPluginBase<THeftEventAction extends IHeftConfigurationJsonEventActionBase> implements IHeftPlugin {
    abstract readonly pluginName: string;
    protected abstract readonly eventActionName: keyof IHeftEventActions;
    protected abstract readonly loggerName: string;
    apply(heftSession: HeftSession, heftConfiguration: HeftConfiguration): void;
    protected handleCleanEventActionsAsync(heftEvent: HeftEvent, heftEventActions: THeftEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: ICleanStageProperties): Promise<void>;
    protected handleBuildEventActionsAsync(heftEvent: HeftEvent, heftEventActions: THeftEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: IBuildStageProperties): Promise<void>;
    protected handleTestEventActionsAsync(heftEvent: HeftEvent, heftEventActions: THeftEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: ITestStageProperties): Promise<void>;
    private _getEventActions;
}
//# sourceMappingURL=HeftEventPluginBase.d.ts.map