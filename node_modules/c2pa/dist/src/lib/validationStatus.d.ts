/**
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
import { ValidationStatus } from "@contentauth/toolkit";
export declare const OTGP_ERROR_CODE = "assertion.dataHash.mismatch";
/**
 * Determines if a validation status list contains an OTGP (`assertion.dataHash.mismatch`)
 * status
 *
 * @param validationStatus
 * @returns `true` if we find an OTGP status
 */
export declare function hasOtgpStatus(validationStatus?: ValidationStatus[]): boolean;
/**
 * Determines if a validation status list contains an error (anything not in the c2pa-rs
 * `C2PA_STATUS_VALID_SET` list _and_ not an OTGP status)
 *
 * @param validationStatus
 * @returns `true` if we find an error
 */
export declare function hasErrorStatus(validationStatus?: any[]): boolean;
//# sourceMappingURL=validationStatus.d.ts.map