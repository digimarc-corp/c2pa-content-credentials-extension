import { HeftActionBase, IHeftActionBaseOptions } from './HeftActionBase';
export declare class CleanAction extends HeftActionBase {
    private _deleteCacheFlag;
    constructor(options: IHeftActionBaseOptions);
    onDefineParameters(): void;
    protected actionExecuteAsync(): Promise<void>;
}
//# sourceMappingURL=CleanAction.d.ts.map