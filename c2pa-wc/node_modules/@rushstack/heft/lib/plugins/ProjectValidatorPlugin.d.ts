import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { IHeftPlugin } from '../pluginFramework/IHeftPlugin';
import { HeftSession } from '../pluginFramework/HeftSession';
/**
 * This plugin is a place to do generic project-level validation. For example, ensuring that only expected
 * files are in the ".heft" folder (i.e. - legacy config files aren't still there)
 */
export declare class ProjectValidatorPlugin implements IHeftPlugin {
    readonly pluginName: string;
    apply(heftSession: HeftSession, heftConfiguration: HeftConfiguration): void;
    private _scanHeftDataFolderAsync;
    /**
     * A utility method to use as the tap function to the provided hook. Determines if the
     * requested plugin is installed and warns otherwise if related configuration files were
     * found. Returns false if the plugin was found, otherwise true.
     */
    private _checkPluginIsMissingAsync;
}
//# sourceMappingURL=ProjectValidatorPlugin.d.ts.map