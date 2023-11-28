/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { LitElement } from 'lit';
import { PanelSectionConfig } from './panelSection';
declare type Constructor<T = {}> = new (...args: any[]) => T;
interface ConfigurablePanelSectionConfig<DataType> extends PanelSectionConfig<DataType> {
    config: Record<string, any>;
}
export declare const ConfigurablePanelSection: <T extends Constructor<LitElement>, DataType>(superClass: T, config: ConfigurablePanelSectionConfig<DataType>) => (new (...args: any[]) => import("./configurable").ConfigurableInterface<Record<string, any>>) & (new (...args: any[]) => import("./panelSection").PanelSectionInterface<DataType>) & T;
export {};
