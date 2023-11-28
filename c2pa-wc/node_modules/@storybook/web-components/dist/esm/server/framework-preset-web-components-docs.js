import { findDistEsm } from '@storybook/core-common';
import { hasDocsOrControls } from '@storybook/docs-tools';
export var previewAnnotations = function (entry = [], options) {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, findDistEsm(__dirname, 'client/docs/config')];
};