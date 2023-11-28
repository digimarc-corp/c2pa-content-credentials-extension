"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeftEventPluginBase = void 0;
const CoreConfigFiles_1 = require("../utilities/CoreConfigFiles");
class HeftEventPluginBase {
    apply(heftSession, heftConfiguration) {
        const logger = heftSession.requestScopedLogger(this.loggerName);
        const heftStageTap = {
            name: this.pluginName,
            stage: Number.MAX_SAFE_INTEGER / 2 // This should give us some certainty that this will run after other plugins
        };
        const handleEventActionsAsync = async (heftEvent, properties, handler) => {
            const heftEventActions = await this._getEventActions(heftEvent, logger, heftConfiguration);
            if (heftEventActions.length) {
                await handler(heftEvent, heftEventActions, logger, heftSession, heftConfiguration, properties);
            }
        };
        heftSession.hooks.clean.tap(this.pluginName, (clean) => {
            clean.hooks.run.tapPromise(heftStageTap, async () => {
                await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.clean, clean.properties, this.handleCleanEventActionsAsync.bind(this));
            });
        });
        heftSession.hooks.build.tap(this.pluginName, (build) => {
            build.hooks.preCompile.tap(this.pluginName, (preCompile) => {
                preCompile.hooks.run.tapPromise(heftStageTap, async () => {
                    await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.preCompile, build.properties, this.handleBuildEventActionsAsync.bind(this));
                });
            });
            build.hooks.compile.tap(this.pluginName, (compile) => {
                compile.hooks.run.tapPromise(heftStageTap, async () => {
                    await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.compile, build.properties, this.handleBuildEventActionsAsync.bind(this));
                });
            });
            build.hooks.bundle.tap(this.pluginName, (bundle) => {
                bundle.hooks.run.tapPromise(heftStageTap, async () => {
                    await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.bundle, build.properties, this.handleBuildEventActionsAsync.bind(this));
                });
            });
            build.hooks.postBuild.tap(this.pluginName, (postBuild) => {
                postBuild.hooks.run.tapPromise(heftStageTap, async () => {
                    await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.postBuild, build.properties, this.handleBuildEventActionsAsync.bind(this));
                });
            });
        });
        heftSession.hooks.test.tap(this.pluginName, (test) => {
            test.hooks.run.tapPromise(heftStageTap, async () => {
                await handleEventActionsAsync(CoreConfigFiles_1.HeftEvent.test, test.properties, this.handleTestEventActionsAsync.bind(this));
            });
        });
    }
    handleCleanEventActionsAsync(heftEvent, heftEventActions, logger, heftSession, heftConfiguration, properties) {
        return Promise.resolve();
    }
    handleBuildEventActionsAsync(heftEvent, heftEventActions, logger, heftSession, heftConfiguration, properties) {
        return Promise.resolve();
    }
    handleTestEventActionsAsync(heftEvent, heftEventActions, logger, heftSession, heftConfiguration, properties) {
        return Promise.resolve();
    }
    async _getEventActions(heftEvent, logger, heftConfiguration) {
        const allEventActions = await CoreConfigFiles_1.CoreConfigFiles.getConfigConfigFileEventActionsAsync(logger.terminal, heftConfiguration);
        const baseEventActions = allEventActions[this.eventActionName].get(heftEvent) || [];
        return baseEventActions;
    }
}
exports.HeftEventPluginBase = HeftEventPluginBase;
//# sourceMappingURL=HeftEventPluginBase.js.map