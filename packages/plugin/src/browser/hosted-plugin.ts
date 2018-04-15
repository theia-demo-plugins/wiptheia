/*
 * Copyright (C) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
import { injectable, inject, interfaces } from 'inversify';
import { HostedPluginServer, PluginModel, PluginLifecycle } from '../common/plugin-protocol';
import { PluginWorker } from './plugin-worker';
import { setUpPluginApi } from './main-context';
import { MAIN_RPC_CONTEXT } from '../api/plugin-api';
import { HostedPluginWatcher } from './hosted-plugin-watcher';
import { RPCProtocol, RPCProtocolImpl } from '../api/rpc-protocol';
@injectable()
export class HostedPluginSupport {
    private worker: PluginWorker;

    constructor(@inject(HostedPluginServer) private readonly server: HostedPluginServer,
        @inject(HostedPluginWatcher) private readonly watcher: HostedPluginWatcher) {
    }

    checkAndLoadPlugin(container: interfaces.Container): void {
        this.server.getHostedPlugin().then((pluginMedata: any) => {
            if (pluginMedata) {
                this.loadPlugin(pluginMedata.model, pluginMedata.lifecycle, container);
            }
        });
    }

    private loadPlugin(plugin: PluginModel, pluginLifecycle: PluginLifecycle, container: interfaces.Container): void {
        if (plugin.entryPoint!.frontend) {
            console.log(`Loading hosted plugin: ${plugin.name}`);
            this.worker = new PluginWorker();
            setUpPluginApi(this.worker.rpc, container);
            const hostedExtManager = this.worker.rpc.getProxy(MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT);
            hostedExtManager.$loadPlugin({
                pluginPath: plugin.entryPoint.frontend!,
                model: plugin,
                lifecycle: pluginLifecycle
            });
        }
        if (plugin.entryPoint!.backend) {
            const rpc = this.createServerRpc();
            setUpPluginApi(rpc, container);
            const hostedExtManager = rpc.getProxy(MAIN_RPC_CONTEXT.HOSTED_PLUGIN_MANAGER_EXT);
            hostedExtManager.$loadPlugin({
                pluginPath: plugin.entryPoint.backend!,
                model: plugin,
                lifecycle: pluginLifecycle
            });
        }
    }

    private createServerRpc(): RPCProtocol {
        return new RPCProtocolImpl({
            onMessage: this.watcher.onPostMessageEvent,
            send: message => this.server.onMessage(JSON.stringify(message))
        });
    }
}
