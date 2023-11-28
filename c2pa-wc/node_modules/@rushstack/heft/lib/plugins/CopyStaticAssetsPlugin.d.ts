import { HeftSession } from '../pluginFramework/HeftSession';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { CopyFilesPlugin } from './CopyFilesPlugin';
export declare class CopyStaticAssetsPlugin extends CopyFilesPlugin {
    private static __partialTsconfigFileLoader;
    private static get _partialTsconfigFileLoader();
    /**
     * @override
     */
    readonly pluginName: string;
    /**
     * @override
     */
    apply(heftSession: HeftSession, heftConfiguration: HeftConfiguration): void;
    private _loadCopyStaticAssetsConfigurationAsync;
    private _tryGetTsconfigOutDirPathAsync;
}
//# sourceMappingURL=CopyStaticAssetsPlugin.d.ts.map