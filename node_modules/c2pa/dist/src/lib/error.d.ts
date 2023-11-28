/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { BaseError } from 'make-error';
export declare class IncompatibleBrowserError extends BaseError {
    constructor();
}
export declare class MissingWasmSourceError extends BaseError {
    constructor();
}
export declare class MissingWorkerSourceError extends BaseError {
    constructor();
}
export declare class InvalidWorkerSourceError extends BaseError {
    url: string;
    response: Response | null;
    originalError: TypeError | null;
    constructor(url: string, res: Response | null, err?: TypeError);
}
export declare class InvalidInputError extends BaseError {
    constructor();
}
export declare class InvalidMimeTypeError extends BaseError {
    mimeType: string;
    constructor(mimeType: string);
}
export declare class UrlFetchError extends BaseError {
    url: string;
    response: Response | null;
    originalError: TypeError | null;
    constructor(url: string, res: Response | null, err?: TypeError);
}
export declare class DictionaryUrlNotFoundError extends BaseError {
    constructor();
}
//# sourceMappingURL=error.d.ts.map