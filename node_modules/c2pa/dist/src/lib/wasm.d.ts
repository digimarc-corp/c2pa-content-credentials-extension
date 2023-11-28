/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { SdkWorkerPool } from './poolWrapper';
/**
 * Fetches the WASM binary from a supplied URL
 *
 * @param pool Worker pool to be used when compiling WASM
 * @param binaryUrl URL pointing to WASM binary
 */
export declare function fetchWasm(pool: SdkWorkerPool, binaryUrl: string): Promise<WebAssembly.Module>;
//# sourceMappingURL=wasm.d.ts.map