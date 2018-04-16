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
import { MAIN_RPC_CONTEXT } from '../api/plugin-api';
import { RPCProtocol } from '../api/rpc-protocol';
import * as theia from '@theia/plugin';
import { CommandRegistryImpl } from './command-registry';
import { Disposable } from './types-impl';
import { Plugin } from '../api/plugin-api';
import { getPluginId } from '../common/plugin-protocol';

export function createAPI(rpc: RPCProtocol): typeof theia {
    const commandRegistryExt = rpc.set(MAIN_RPC_CONTEXT.COMMAND_REGISTRY_EXT, new CommandRegistryImpl(rpc));

    const commands: typeof theia.commands = {
        registerCommand(command: theia.Command, handler?: <T>(...args: any[]) => T | Thenable<T>): Disposable {
            return commandRegistryExt.registerCommand(command, handler);
        },
        executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined> {
            return commandRegistryExt.executeCommand<T>(commandId, args);
        },
        registerTextEditorCommand(command: theia.Command, callback: (textEditor: theia.TextEditor, edit: theia.TextEditorEdit, ...arg: any[]) => void): Disposable {
            throw new Error("Function registerTextEditorCommand is not implemented");
        },
        registerHandler(commandId: string, handler: (...args: any[]) => any): Disposable {
            return commandRegistryExt.registerHandler(commandId, handler);
        }
    };
    return <typeof theia>{
        commands,
        Disposable: Disposable
    };

}

export function startPlugin(plugin: Plugin, pluginMain: any, plugins: Map<string, () => void>): void {
    if (typeof pluginMain[plugin.lifecycle.startMethod] === 'function') {
        pluginMain[plugin.lifecycle.startMethod].apply(global, []);
    } else {
        console.log('there is no doStart method on plugin');
    }

    if (typeof pluginMain[plugin.lifecycle.stopMethod] === 'function') {
        const pluginId = getPluginId(plugin.model)
        plugins.set(pluginId, pluginMain[plugin.lifecycle.stopMethod]);
    }
}
