/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
export declare class ConfigurableInterface<ConfigType extends Record<string, any>> {
    config: Partial<ConfigType>;
    protected _config: ConfigType;
}
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare const Configurable: <T extends Constructor<LitElement>, ConfigType extends Record<string, any>>(superClass: T, defaultConfig: ConfigType) => Constructor<ConfigurableInterface<ConfigType>> & T;
export {};
