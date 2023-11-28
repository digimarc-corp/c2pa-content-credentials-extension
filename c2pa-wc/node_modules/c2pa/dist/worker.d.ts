/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ManifestStore } from '@contentauth/toolkit';
export interface IScanResult {
    found: boolean;
    offset?: number;
}
declare const worker: {
    compileWasm(buffer: ArrayBuffer): Promise<WebAssembly.Module>;
    getReport(wasm: WebAssembly.Module, buffer: ArrayBuffer, type: string): Promise<ManifestStore>;
    getReportFromAssetAndManifestBuffer(wasm: WebAssembly.Module, manifestBuffer: ArrayBuffer, asset: Blob): Promise<ManifestStore>;
    scanInput(wasm: WebAssembly.Module, buffer: ArrayBuffer): Promise<IScanResult>;
};
export declare type Worker = typeof worker;
export {};
//# sourceMappingURL=worker.d.ts.map