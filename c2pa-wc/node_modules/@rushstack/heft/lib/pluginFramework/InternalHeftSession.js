"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalHeftSession = void 0;
const tapable_1 = require("tapable");
const HeftSession_1 = require("./HeftSession");
/**
 * @internal
 */
class InternalHeftSession {
    constructor(options) {
        this._pluginHooks = new Map();
        this._options = options;
    }
    getSessionForPlugin(thisPlugin) {
        return new HeftSession_1.HeftSession({
            plugin: thisPlugin,
            requestAccessToPluginByName: (pluginToAccessName, pluginApplyFn) => {
                let pluginHook = this._pluginHooks.get(pluginToAccessName);
                if (!pluginHook) {
                    pluginHook = new tapable_1.SyncHook(['pluginAccessor']);
                    this._pluginHooks.set(pluginToAccessName, pluginHook);
                }
                pluginHook.tap(thisPlugin.pluginName, pluginApplyFn);
            }
        }, this._options);
    }
    applyPluginHooks(plugin) {
        const pluginHook = this._pluginHooks.get(plugin.pluginName);
        const accessor = plugin.accessor;
        if (pluginHook && pluginHook.taps.length > 0) {
            if (!accessor) {
                const accessingPlugins = new Set(pluginHook.taps.map((x) => x.name));
                throw new Error(`Plugin "${plugin.pluginName}" does not provide an accessor property, so it does not provide ` +
                    `access to other plugins. Plugins requesting access to "${plugin.pluginName}: ` +
                    Array.from(accessingPlugins).join(', '));
            }
            else {
                pluginHook.call(accessor);
            }
        }
    }
}
exports.InternalHeftSession = InternalHeftSession;
//# sourceMappingURL=InternalHeftSession.js.map