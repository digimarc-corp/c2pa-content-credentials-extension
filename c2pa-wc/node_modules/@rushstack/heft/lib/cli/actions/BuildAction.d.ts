import { CommandLineFlagParameter, ICommandLineActionOptions } from '@rushstack/ts-command-line';
import { HeftActionBase, IHeftActionBaseOptions } from './HeftActionBase';
export declare class BuildAction extends HeftActionBase {
    protected _watchFlag: CommandLineFlagParameter;
    protected _productionFlag: CommandLineFlagParameter;
    protected _liteFlag: CommandLineFlagParameter;
    private _buildStandardParameters;
    private _cleanFlag;
    constructor(heftActionOptions: IHeftActionBaseOptions, commandLineActionOptions?: ICommandLineActionOptions);
    onDefineParameters(): void;
    protected actionExecuteAsync(): Promise<void>;
    protected runCleanIfRequestedAsync(): Promise<void>;
    protected runBuildAsync(): Promise<void>;
    protected afterExecuteAsync(): Promise<void>;
}
//# sourceMappingURL=BuildAction.d.ts.map