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
import { Disposable } from '../plugin/types-impl';

export const hostedServicePath = '/services/hostedPlugin';

export type pluginEngine = string;
export interface PluginPackage {
    name: string;
    publisher: string;
    version: string;
    engines: {
        [type in pluginEngine]: string;
    };
    theiaPlugin?: {
        frontend?: string,
        backend?: string
    };
    main?: string;
    displayName: string;
    description: string;
    contributes: {};
}

export const PluginScanner = Symbol('PluginScanner');
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
    getLifecycle(): PluginLifecycle;
}

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

export interface PluginLifecycle {
    startMethod: string;
    stopMethod: string;
    pluginContext: PluginContext | ExtensionContext;
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

export const HostedPluginClient = Symbol('HostedPluginClient');
export interface HostedPluginClient {
    postMessage(message: string): Promise<void>;
}

export const HostedPluginServer = Symbol('HostedPluginServer');
export interface HostedPluginServer extends JsonRpcServer<HostedPluginClient> {
    getHostedPlugin(): Promise<PluginMetadata | undefined>;
    onMessage(message: string): Promise<void>;
}
