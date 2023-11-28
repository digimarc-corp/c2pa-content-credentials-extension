"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewAnnotations = void 0;

var _coreCommon = require("@storybook/core-common");

var _docsTools = require("@storybook/docs-tools");

var previewAnnotations = function (entry = [], options) {
  if (!(0, _docsTools.hasDocsOrControls)(options)) return entry;
  return [...entry, (0, _coreCommon.findDistEsm)(__dirname, 'client/docs/config')];
};

exports.previewAnnotations = previewAnnotations;