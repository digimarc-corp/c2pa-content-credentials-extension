/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { Worker } from '../../worker';
import { WorkerPoolConfig } from './pool/workerPool';
export interface SdkWorkerPool extends Worker {
    dispose: () => void;
}
export declare function createPoolWrapper(config: WorkerPoolConfig): Promise<SdkWorkerPool>;
//# sourceMappingURL=poolWrapper.d.ts.map