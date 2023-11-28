/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { L2ManifestStore } from 'c2pa';
import { LitElement, TemplateResult } from 'lit';
export declare class PanelSectionInterface<DataType> {
    manifestStore: L2ManifestStore | undefined;
    protected _data: DataType;
    protected _isEmpty: boolean;
    renderSection: (content: TemplateResult) => TemplateResult;
}
export interface PanelSectionConfig<DataType> {
    dataSelector: (manifestStore: L2ManifestStore) => DataType;
    isEmpty?: (data: DataType) => boolean;
}
declare type Constructor<T = {}> = new (...args: any[]) => T;
export declare const PanelSection: <T extends Constructor<LitElement>, DataType>(superClass: T, config: PanelSectionConfig<DataType>) => Constructor<PanelSectionInterface<DataType>> & T;
export {};
