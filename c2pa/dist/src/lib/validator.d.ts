/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { SdkWorkerPool } from './poolWrapper';
/**
 * Handles validation of input before processing it for C2PA metadata
 *
 * @public
 */
export declare class Validator {
    #private;
    static readonly VALID_MIME_TYPES: string[];
    static readonly DEFAULT_DETECTION_LENGTH = 65535;
    constructor(pool: SdkWorkerPool, detectionLength: number | undefined);
    /**
     * Sanitizes mime type strings for proper file type checking
     *
     * @remarks
     * We need to do this since some Content-Types can coming in such as `image/jpeg; charset=utf-8`.
     *
     * @param type - The mime type of the asset
     */
    static sanitizeMimeType(type: string): string;
    /**
     * Checks if the asset has a mime type that is compatible with C2PA
     *
     * @param type - The mime type of the asset to check
     */
    static isValidMimeType(type: string): boolean;
    /**
     * Scans an individual binary chunk for a C2PA metadata marker
     *
     * @param chunk - the chunk to check for the metadata marker
     */
    scanChunk(chunk: ArrayBuffer): Promise<import("../../worker").IScanResult>;
    /**
     * Scans a buffer/Blob for a C2PA metadata marker
     *
     * @remarks
     * This will automatically handle both a `ArrayBuffer` or a `Blob` as input
     * and automatically decide if it should be passed as a transferable object or not.
     * It will then pass it to `scanChunk` for the actual processing.
     *
     * @param input - The buffer/blob to scan
     */
    scanInput(input: ArrayBuffer | Blob): Promise<import("../../worker").IScanResult>;
}
//# sourceMappingURL=validator.d.ts.map