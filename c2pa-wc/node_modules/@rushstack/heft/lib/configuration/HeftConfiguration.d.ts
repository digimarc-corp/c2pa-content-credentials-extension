import { Terminal, ITerminalProvider, IPackageJson } from '@rushstack/node-core-library';
import { RigConfig } from '@rushstack/rig-package';
/**
 * @internal
 */
export interface IHeftConfigurationInitializationOptions {
    /**
     * The working directory the tool was executed in.
     */
    cwd: string;
    /**
     * Terminal instance to facilitate logging.
     */
    terminalProvider: ITerminalProvider;
}
/**
 * The base action configuration that all custom action configuration files
 * should inherit from.
 *
 * @public
 */
export interface IHeftActionConfiguration {
}
/**
 * Options to be used when retrieving the action configuration.
 *
 * @public
 */
export interface IHeftActionConfigurationOptions {
    /**
     * Whether or not arrays should be merged across Heft action configuration files.
     */
    mergeArrays?: boolean;
}
/**
 * @public
 */
export declare class HeftConfiguration {
    private _buildFolder;
    private _projectHeftDataFolder;
    private _projectConfigFolder;
    private _buildCacheFolder;
    private _rigConfig;
    private _globalTerminal;
    private _terminalProvider;
    /**
     * Project build folder. This is the folder containing the project's package.json file.
     */
    get buildFolder(): string;
    /**
     * The path to the project's ".heft" folder.
     */
    get projectHeftDataFolder(): string;
    /**
     * The path to the project's "config" folder.
     */
    get projectConfigFolder(): string;
    /**
     * The project's build cache folder.
     *
     * This folder exists at \<project root\>/.heft/build-cache. TypeScript's output
     * goes into this folder and then is either copied or linked to the final output folder
     */
    get buildCacheFolder(): string;
    /**
     * The rig.json configuration for this project, if present.
     */
    get rigConfig(): RigConfig;
    /**
     * Terminal instance to facilitate logging.
     */
    get globalTerminal(): Terminal;
    /**
     * Terminal provider for the provided terminal.
     */
    get terminalProvider(): ITerminalProvider;
    /**
     * The Heft tool's package.json
     */
    get heftPackageJson(): IPackageJson;
    /**
     * The package.json of the project being built
     */
    get projectPackageJson(): IPackageJson;
    private constructor();
    /**
     * Performs the search for rig.json and initializes the `HeftConfiguration.rigConfig` object.
     * @internal
     */
    _checkForRigAsync(): Promise<void>;
    /**
     * @internal
     */
    static initialize(options: IHeftConfigurationInitializationOptions): HeftConfiguration;
}
//# sourceMappingURL=HeftConfiguration.d.ts.map