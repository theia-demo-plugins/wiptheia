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
import { JsonRpcServer } from '@theia/core/lib/common/messaging/proxy-factory';
import { RPCProtocol } from '../api/rpc-protocol';
import { Disposable } from '../plugin/types-impl';

export const hostedServicePath = '/services/hostedPlugin';

/**
 * Plugin engine (API) type, i.e. 'theia', 'vscode', etc.
 */
export type pluginEngine = string;

/**
 * This interface describes a package.json object.
 */
export interface PluginPackage {
    name: string;
    publisher: string;
    version: string;
    engines: {
        [type in pluginEngine]: string;
    };
    theiaPlugin?: {
        frontend?: string;
        frontendModuleName?: string;
        backend?: string;
    };
    main?: string;
    displayName: string;
    description: string;
    contributes: {};
}

export const PluginScanner = Symbol('PluginScanner');

/**
 * This scanner process package.json object and returns plugin metadata objects.
 */
export interface PluginScanner {
    /**
     * The type of plugin's API (engine name)
     */
    apiType: pluginEngine;

    /**
     * Creates plugin's model.
     *
     * @param {PluginPackage} plugin
     * @returns {PluginModel}
     */
    getModel(plugin: PluginPackage): PluginModel;

    /**
     * Creates plugin's lifecycle.
     *
     * @returns {PluginLifecycle}
     */
    getLifecycle(plugin: PluginPackage): PluginLifecycle;
}

/**
 * This interface describes a plugin model object, which is populated from package.json.
 */
export interface PluginModel {
    name: string;
    publisher: string;
    version: string;
    displayName: string;
    description: string;
    engine: {
        type: pluginEngine;
        version: string;
    };
    entryPoint: {
        frontend?: string;
        backend?: string;
    };
}

/**
 * This interface describes a plugin lifecycle object.
 */
export interface PluginLifecycle {
    startMethod: string;
    stopMethod: string;
    /**
     * Frontend module name, frontend plugin should expose this name.
     */
    frontendModuleName?: string;
    /**
     * Path to the script which should do some initialization before frontend plugin is loaded.
     */
    frontendInitPath?: string;
    /**
     * Path to the script which should do some initialization before backend plugin is loaded.
     */
    backendInitPath?: string;
}

/**
 * The export function of initialization module of backend plugin.
 */
export interface BackendInitializationFn {
    (rpc: RPCProtocol): void;
}

export interface PluginContext {
    subscriptions: Disposable[];
}

export interface ExtensionContext {
    subscriptions: Disposable[];
}

export interface PluginMetadata {
    model: PluginModel;
    lifecycle: PluginLifecycle;
}

export function getPluginId(plugin: PluginPackage | PluginModel): string {
    return `${plugin.publisher}_${plugin.name}`;
}

export const HostedPluginClient = Symbol('HostedPluginClient');
export interface HostedPluginClient {
    postMessage(message: string): Promise<void>;
}

export const HostedPluginServer = Symbol('HostedPluginServer');
export interface HostedPluginServer extends JsonRpcServer<HostedPluginClient> {
    getHostedPlugin(): Promise<PluginMetadata | undefined>;
    onMessage(message: string): Promise<void>;
}
