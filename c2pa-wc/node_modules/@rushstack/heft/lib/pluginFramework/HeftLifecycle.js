"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeftLifecycleHooks = void 0;
const tapable_1 = require("tapable");
/** @internal */
class HeftLifecycleHooks {
    constructor() {
        this.toolStart = new tapable_1.AsyncParallelHook();
    }
}
exports.HeftLifecycleHooks = HeftLifecycleHooks;
//# sourceMappingURL=HeftLifecycle.js.map