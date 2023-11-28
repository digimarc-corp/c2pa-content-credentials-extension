"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
const SubprocessRunnerBase_1 = require("./SubprocessRunnerBase");
const [, , subprocessModulePath, serializedInnerConfiguration, serializedSubprocessConfiguration] = process.argv;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subprocessRunnerModule = require(subprocessModulePath);
const subprocessRunnerModuleExports = Object.getOwnPropertyNames(subprocessRunnerModule).filter((exportName) => exportName !== '__esModule');
if (subprocessRunnerModuleExports.length !== 1) {
    throw new Error(`The provided subprocess module path (${subprocessModulePath}) must only have a single value exported.`);
}
const SubprocessRunnerClass = subprocessRunnerModule[subprocessRunnerModuleExports[0]];
if (!SubprocessRunnerClass[SubprocessRunnerBase_1.SUBPROCESS_RUNNER_CLASS_LABEL]) {
    throw new Error(`The provided subprocess module path (${subprocessModulePath}) does not extend from the ` +
        'SubprocessRunnerBase class.');
}
const innerConfiguration = JSON.parse(serializedInnerConfiguration);
const subprocessConfiguration = JSON.parse(serializedSubprocessConfiguration);
const subprocessRunner = SubprocessRunnerClass.initializeSubprocess(SubprocessRunnerClass, innerConfiguration, subprocessConfiguration);
subprocessRunner[SubprocessRunnerBase_1.SUBPROCESS_RUNNER_INNER_INVOKE].call(subprocessRunner).catch(console.error);
//# sourceMappingURL=startSubprocess.js.map