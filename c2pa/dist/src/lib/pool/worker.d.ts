/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
export interface WorkerRequest {
    method: string;
    args: unknown[];
}
export interface WorkerResponseSuccess {
    type: 'success';
    data: any;
}
export interface WorkerResponseError {
    type: 'error';
    error: any;
}
export declare type WorkerResponse = WorkerResponseSuccess | WorkerResponseError;
declare type WorkerMethods = Record<string, (...args: any[]) => any>;
export declare function setupWorker(methods: WorkerMethods): void;
export {};
//# sourceMappingURL=worker.d.ts.map