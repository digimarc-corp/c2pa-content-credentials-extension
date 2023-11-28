import { ScopedLogger } from '../pluginFramework/logging/ScopedLogger';
import { HeftEventPluginBase } from '../pluginFramework/HeftEventPluginBase';
import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { IExtendedSharedCopyConfiguration, IHeftEventActions, IHeftConfigurationCopyFilesEventAction, HeftEvent } from '../utilities/CoreConfigFiles';
import { IBuildStageProperties } from '../stages/BuildStage';
export interface IResolvedDestinationCopyConfiguration extends IExtendedSharedCopyConfiguration {
    /**
     * Fully-qualified folder paths to which files should be copied.
     */
    resolvedDestinationFolderPaths: string[];
}
export interface ICopyFilesOptions {
    buildFolder: string;
    copyConfigurations: IResolvedDestinationCopyConfiguration[];
    logger: ScopedLogger;
    watchMode: boolean;
}
export interface ICopyFilesResult {
    copiedFileCount: number;
    linkedFileCount: number;
}
export declare class CopyFilesPlugin extends HeftEventPluginBase<IHeftConfigurationCopyFilesEventAction> {
    readonly pluginName: string;
    protected eventActionName: keyof IHeftEventActions;
    protected loggerName: string;
    /**
     * @override
     */
    protected handleBuildEventActionsAsync(heftEvent: HeftEvent, heftEventActions: IHeftConfigurationCopyFilesEventAction[], logger: ScopedLogger, heftSession: HeftSession, heftConfiguration: HeftConfiguration, properties: IBuildStageProperties): Promise<void>;
    private _runCopyFilesForHeftEventActions;
    protected runCopyAsync(options: ICopyFilesOptions): Promise<void>;
    private _copyFilesAsync;
    private _getCopyFileDescriptorsAsync;
    private _getIncludedGlobPatterns;
    private _runWatchAsync;
}
//# sourceMappingURL=CopyFilesPlugin.d.ts.map