/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { flow, pickBy, keys, join, negate } from 'lodash/fp';
import deepEqual from 'fast-deep-equal';

/**
 * Converts an object of keys and values (where the values are truthy values or functions
 * that return something truthy) into a space-delimited set of strings, suitable for a
 * class list or parts list. Made this because LitElement's classMap doesn't work with `part`
 * attributes.
 */
export const classPartMap = flow(
  pickBy((v) => (typeof v === 'function' ? v() : v) == true),
  keys,
  join(' '),
);

export const hasChanged = negate(deepEqual);

export function defaultDateFormatter(date: Date) {
  const df = new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  return df.format(date);
}
