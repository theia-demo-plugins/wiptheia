/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { createProxyIdentifier, ProxyIdentifier } from './rpc-protocol';
import * as theia from '@theia/plugin';
import { PluginLifecycle, PluginModel } from '../common/plugin-protocol';

export interface HostedPluginManagerExt {
    $initialize(contextPath: string): void;
    $loadPlugin(plugin: Plugin): void;
    $stopPlugin(): PromiseLike<void>;
}

export interface Plugin {
    pluginPath: string;
    model: PluginModel;
    lifecycle: PluginLifecycle; // todo maybe PluginMetadata should be usedd here?
}

export interface CommandRegistryMain {
    $registerCommand(command: theia.Command): void;

    $unregisterCommand(id: string): void;
    $executeCommand<T>(id: string, args: any[]): PromiseLike<T | undefined>;
    $getCommands(): PromiseLike<string[]>;
}

export interface TerminalManagerExt {
    $createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): theia.Terminal;
    $createTerminal(options: theia.TerminalOptions): theia.Terminal;
    // $onDidCloseTerminal: theia.Event<theia.Terminal>;
}

export interface CommandRegistryExt {
    $executeCommand<T>(id: string, ...ars: any[]): PromiseLike<T>;
}

export interface AutoFocus {
    autoFocusFirstEntry?: boolean;
    // TODO
}

export interface PickOptions {
    placeHolder?: string;
    autoFocus?: AutoFocus;
    matchOnDescription?: boolean;
    matchOnDetail?: boolean;
    ignoreFocusLost?: boolean;
    quickNavigationConfiguration?: {}; // TODO
    contextKey?: string;
    canSelectMany?: boolean;
}

export interface PickOpenItem {
    handle: number;
    id?: string;
    label: string;
    description?: string;
    detail?: string;
    picked?: boolean;
}
export interface QuickOpenExt {
    $onItemSelected(handle: number): void;
    $validateInput(input: string): PromiseLike<string> | undefined;
}

export interface QuickOpenMain {
    $show(options: PickOptions): PromiseLike<number | number[]>;
    $setItems(items: PickOpenItem[]): PromiseLike<any>;
    $setError(error: Error): PromiseLike<any>;
    $input(options: theia.InputBoxOptions, validateInput: boolean): PromiseLike<string>;
}

export const PLUGIN_RPC_CONTEXT = {
    COMMAND_REGISTRY_MAIN: <ProxyIdentifier<CommandRegistryMain>>createProxyIdentifier<CommandRegistryMain>('CommandRegistryMain'),
    QUICK_OPEN_MAIN: createProxyIdentifier<QuickOpenMain>('QuickOpenMain'),
    TERMINAL_MANAGER_EXT: createProxyIdentifier<TerminalManagerExt>("TerminalManagerExt")
};

export const MAIN_RPC_CONTEXT = {
    HOSTED_PLUGIN_MANAGER_EXT: createProxyIdentifier<HostedPluginManagerExt>('HostedPluginManagerExt'),
    COMMAND_REGISTRY_EXT: createProxyIdentifier<CommandRegistryExt>('CommandRegistryExt'),
    QUICK_OPEN_EXT: createProxyIdentifier<QuickOpenExt>('QuickOpenExt'),
    TERMINAL_MANAGER_EXT: createProxyIdentifier<TerminalManagerExt>("TerminalManagerExt")
};
