/*
 * Copyright (C) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { resolve } from 'path';
import { RPCProtocolImpl } from '../api/rpc-protocol';
import { Emitter } from '@theia/core/lib/common/event';
import { startPlugin } from '../plugin/plugin-context';
import { MAIN_RPC_CONTEXT } from '../api/plugin-api';
import { HostedPluginManagerExtImpl } from '../plugin/hosted-plugin-manager';
import { Plugin } from '../api/plugin-api';

const plugins = new Map<string, () => void>();

const emmitter = new Emitter();
const rpc = new RPCProtocolImpl({
    onMessage: emmitter.event,
    send: (m: {}) => {
        if (process.send) {
            process.send(JSON.stringify(m));
        }
    }
});
process.on('message', (message: any) => {
    console.log("Ext: " + message);
    emmitter.fire(JSON.parse(message));
});

rpc.set(MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT, new HostedPluginManagerExtImpl({
    initialize(contextPath: string): void {
        const backendInitPath = resolve(__dirname, 'context', contextPath);
        const backendInit = require(backendInitPath);
        backendInit.doInitialization(rpc);
    },
    loadPlugin(plugin: Plugin): void {
        console.log("Ext: load: " + plugin.pluginPath);

        try {
            const pluginMain = require(plugin.pluginPath);
            startPlugin(plugin, pluginMain, plugins);

        } catch (e) {
            console.error(e);
        }
    },
    stopPlugins(pluginIds: string[]): void {
        console.log("Plugin: Stopping plugin: ", pluginIds);
        pluginIds.forEach(pluginId => {
            const stopPluginMethod = plugins.get(pluginId);
            if (stopPluginMethod) {
                stopPluginMethod();
                plugins.delete(pluginId);
            }
        });
    }
}));
