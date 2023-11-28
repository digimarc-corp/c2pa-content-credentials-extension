import { AsyncParallelHook } from 'tapable';
import { StageBase, StageHooksBase, IStageContext } from './StageBase';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { LoggingManager } from '../pluginFramework/logging/LoggingManager';
/**
 * @public
 */
export declare class CleanStageHooks extends StageHooksBase<ICleanStageProperties> {
    readonly run: AsyncParallelHook;
}
/**
 * @public
 */
export interface ICleanStageProperties {
    deleteCache: boolean;
    pathsToDelete: Set<string>;
}
export interface ICleanStageOptions {
    deleteCache?: boolean;
}
/**
 * @public
 */
export interface ICleanStageContext extends IStageContext<CleanStageHooks, ICleanStageProperties> {
}
export declare class CleanStage extends StageBase<CleanStageHooks, ICleanStageProperties, ICleanStageOptions> {
    constructor(heftConfiguration: HeftConfiguration, loggingManager: LoggingManager);
    protected getDefaultStagePropertiesAsync(options: ICleanStageOptions): Promise<ICleanStageProperties>;
    protected executeInnerAsync(): Promise<void>;
}
//# sourceMappingURL=CleanStage.d.ts.map