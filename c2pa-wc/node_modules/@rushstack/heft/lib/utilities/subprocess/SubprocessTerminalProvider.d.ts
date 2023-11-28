import { ITerminalProvider, TerminalProviderSeverity } from '@rushstack/node-core-library';
import { ISubprocessInnerConfiguration } from './SubprocessRunnerBase';
export declare class SubprocessTerminalProvider implements ITerminalProvider {
    private _builderConfiguration;
    write: (data: string, severity: TerminalProviderSeverity) => void;
    constructor(builderConfiguration: ISubprocessInnerConfiguration, writeFn: (data: string, severity: TerminalProviderSeverity) => void);
    get supportsColor(): boolean;
    get eolCharacter(): string;
}
//# sourceMappingURL=SubprocessTerminalProvider.d.ts.map