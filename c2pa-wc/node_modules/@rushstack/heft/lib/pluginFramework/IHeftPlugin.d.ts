import { JsonSchema } from '@rushstack/node-core-library';
import { HeftConfiguration } from '../configuration/HeftConfiguration';
import { HeftSession } from './HeftSession';
/**
 * @public
 */
export interface IHeftPlugin<TOptions = void> {
    readonly pluginName: string;
    readonly optionsSchema?: JsonSchema;
    readonly accessor?: object;
    apply(heftSession: HeftSession, heftConfiguration: HeftConfiguration, options?: TOptions): void;
}
//# sourceMappingURL=IHeftPlugin.d.ts.map