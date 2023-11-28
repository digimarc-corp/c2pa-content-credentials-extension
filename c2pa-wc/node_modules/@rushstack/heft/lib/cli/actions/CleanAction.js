"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanAction = void 0;
const HeftActionBase_1 = require("./HeftActionBase");
class CleanAction extends HeftActionBase_1.HeftActionBase {
    constructor(options) {
        super({
            actionName: 'clean',
            summary: 'Clean the project',
            documentation: ''
        }, options);
    }
    onDefineParameters() {
        super.onDefineParameters();
        this._deleteCacheFlag = this.defineFlagParameter({
            parameterLongName: '--clear-cache',
            description: "If this flag is provided, the compiler cache will also be cleared. This isn't dangerous, " +
                'but may lead to longer compile times'
        });
    }
    async actionExecuteAsync() {
        const cleanStage = this.stages.cleanStage;
        const cleanStageOptions = {
            deleteCache: this._deleteCacheFlag.value
        };
        await cleanStage.initializeAsync(cleanStageOptions);
        await cleanStage.executeAsync();
    }
}
exports.CleanAction = CleanAction;
//# sourceMappingURL=CleanAction.js.map