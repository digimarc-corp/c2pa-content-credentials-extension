/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
/**
 * Converts an object of keys and values (where the values are truthy values or functions
 * that return something truthy) into a space-delimited set of strings, suitable for a
 * class list or parts list. Made this because LitElement's classMap doesn't work with `part`
 * attributes.
 */
export declare const classPartMap: (object: object | null | undefined) => string;
export declare const hasChanged: (a: any, b: any) => boolean;
export declare function defaultDateFormatter(date: Date): string;
