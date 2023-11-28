/**
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
interface SerializedError {
    [key: string]: any;
}
export declare function serializeError(error: Record<string, any>): SerializedError;
export declare function deserializeError(serializedError: SerializedError): Error;
export {};
//# sourceMappingURL=error.d.ts.map