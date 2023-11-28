/**
 * Copyright 2021 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { BaseError } from 'make-error';

export class IncompatibleBrowserError extends BaseError {
  constructor() {
    super(
      "The browser you are using isn't compatible with this application, or HTTPS is not being used on a non-localhost domain.",
    );
  }
}

export class MissingWasmSourceError extends BaseError {
  constructor() {
    super('No WebAssembly source URL was passed');
  }
}

export class MissingWorkerSourceError extends BaseError {
  constructor() {
    super('No web worker source URL was passed');
  }
}

export class InvalidWorkerSourceError extends BaseError {
  public url: string;

  public response: Response | null;

  public originalError: TypeError | null;

  constructor(url: string, res: Response | null, err?: TypeError) {
    super(`Could not fetch web worker from ${url}`);
    this.url = url;
    this.response = res;
    this.originalError = err ?? null;
  }
}

export class InvalidInputError extends BaseError {
  constructor() {
    super(`Invalid input passed`);
  }
}

export class InvalidMimeTypeError extends BaseError {
  public mimeType: string;

  constructor(mimeType: string) {
    super(`Invalid mime type found on asset`);
    this.mimeType = mimeType;
  }
}

export class UrlFetchError extends BaseError {
  public url: string;

  public response: Response | null;

  public originalError: TypeError | null;

  constructor(url: string, res: Response | null, err?: TypeError) {
    super(`Could not fetch resource from ${url}`);
    this.url = url;
    this.response = res;
    this.originalError = err ?? null;
  }
}

export class DictionaryUrlNotFoundError extends BaseError {
  constructor() {
    super(
      `Dictionary URL not found. Please check you have an 'adobe.dictionary' assertion with a 'url' key.`,
    );
  }
}
