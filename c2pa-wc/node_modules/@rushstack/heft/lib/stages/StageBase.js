"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageBase = exports.StageHooksBase = void 0;
const tapable_1 = require("tapable");
/**
 * @public
 */
class StageHooksBase {
    constructor() {
        /**
         * This hook allows the stage's execution to be completely overridden. Only the last-registered plugin
         * with an override hook provided applies.
         *
         * @beta
         */
        this.overrideStage = new tapable_1.AsyncSeriesBailHook([
            'stageProperties'
        ]);
        this.loadStageConfiguration = new tapable_1.AsyncSeriesHook();
        this.afterLoadStageConfiguration = new tapable_1.AsyncSeriesHook();
    }
}
exports.StageHooksBase = StageHooksBase;
class StageBase {
    constructor(heftConfiguration, loggingManager, innerHooksType) {
        this.heftConfiguration = heftConfiguration;
        this.loggingManager = loggingManager;
        this.globalTerminal = heftConfiguration.globalTerminal;
        this.stageInitializationHook = new tapable_1.SyncHook([
            'stageContext'
        ]);
        this._innerHooksType = innerHooksType;
    }
    async initializeAsync(stageOptions) {
        this.stageOptions = stageOptions;
        this.stageProperties = await this.getDefaultStagePropertiesAsync(this.stageOptions);
        this.stageHooks = new this._innerHooksType();
        const stageContext = {
            hooks: this.stageHooks,
            properties: this.stageProperties
        };
        this.stageInitializationHook.call(stageContext);
        await this.stageHooks.loadStageConfiguration.promise();
        await this.stageHooks.afterLoadStageConfiguration.promise();
    }
    async executeAsync() {
        if (this.stageHooks.overrideStage.isUsed()) {
            await this.stageHooks.overrideStage.promise(this.stageProperties);
        }
        else {
            await this.executeInnerAsync();
        }
    }
}
exports.StageBase = StageBase;
//# sourceMappingURL=StageBase.js.map