"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanStage = exports.CleanStageHooks = void 0;
const tapable_1 = require("tapable");
const node_core_library_1 = require("@rushstack/node-core-library");
const StageBase_1 = require("./StageBase");
/**
 * @public
 */
class CleanStageHooks extends StageBase_1.StageHooksBase {
    constructor() {
        super(...arguments);
        this.run = new tapable_1.AsyncParallelHook();
    }
}
exports.CleanStageHooks = CleanStageHooks;
class CleanStage extends StageBase_1.StageBase {
    constructor(heftConfiguration, loggingManager) {
        super(heftConfiguration, loggingManager, CleanStageHooks);
    }
    async getDefaultStagePropertiesAsync(options) {
        return Object.assign(Object.assign({ deleteCache: false }, options), { pathsToDelete: new Set() });
    }
    async executeInnerAsync() {
        const promises = [];
        if (this.stageProperties.deleteCache) {
            promises.push(node_core_library_1.FileSystem.deleteFolderAsync(this.heftConfiguration.buildCacheFolder));
        }
        promises.push(this.stageHooks.run.promise());
        await Promise.all(promises);
    }
}
exports.CleanStage = CleanStage;
//# sourceMappingURL=CleanStage.js.map