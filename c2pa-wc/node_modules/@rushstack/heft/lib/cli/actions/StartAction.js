"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartAction = void 0;
const HeftActionBase_1 = require("./HeftActionBase");
const BuildStage_1 = require("../../stages/BuildStage");
const Logging_1 = require("../../utilities/Logging");
class StartAction extends HeftActionBase_1.HeftActionBase {
    constructor(heftActionOptions) {
        super({
            actionName: 'start',
            summary: 'Run the local server for the current project',
            documentation: ''
        }, heftActionOptions);
    }
    onDefineParameters() {
        super.onDefineParameters();
        this._buildStandardParameters = BuildStage_1.BuildStage.defineStageStandardParameters(this);
        this._cleanFlag = this.defineFlagParameter({
            parameterLongName: '--clean',
            description: 'If specified, clean the package before starting the development server.'
        });
    }
    async actionExecuteAsync() {
        if (this._cleanFlag.value) {
            const cleanStage = this.stages.cleanStage;
            const cleanStageOptions = {};
            await cleanStage.initializeAsync(cleanStageOptions);
            await Logging_1.Logging.runFunctionWithLoggingBoundsAsync(this.terminal, 'Clean', async () => await cleanStage.executeAsync());
        }
        const buildStage = this.stages.buildStage;
        const buildStageOptions = Object.assign(Object.assign({}, BuildStage_1.BuildStage.getOptionsFromStandardParameters(this._buildStandardParameters)), { watchMode: true, serveMode: true });
        await buildStage.initializeAsync(buildStageOptions);
        await buildStage.executeAsync();
    }
    async afterExecuteAsync() {
        await new Promise(() => {
            /* start should never continue */
        });
    }
}
exports.StartAction = StartAction;
//# sourceMappingURL=StartAction.js.map