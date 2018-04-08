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

export const hostedServicePath = '/services/hostedPlugin';

export type apiType = 'theiaPlugin' | 'vscode';
export interface PluginPackage {
    name: string;
    publisher: string;
    version: string;
    engines: {
        [T in apiType]: string;
    };
    theiaPlugin?: {
        worker?: string,
        node?: string
    };
    main?: string;
    displayName: string;
    description: string;
    contributes: any;
}

export interface PluginModel {
    name: string;
    publisher: string;
    version: string;
    displayName: string;
    description: string;
    engine: {
        type: 'theiaPlugin' | 'vscode';
        version: string;
    };
    entryPoint: {
        frontend?: string;
        backend?: string;
    };
}

export interface PluginLifecycle {
    // todo
}

export const HostedPluginClient = Symbol('HostedPluginClient');
export interface HostedPluginClient {
    postMessage(message: string): Promise<void>;
}

export const HostedPluginServer = Symbol('HostedPluginServer');
export interface HostedPluginServer extends JsonRpcServer<HostedPluginClient> {
    getHostedPlugin(): Promise<PluginModel | undefined>;
    onMessage(message: string): Promise<void>;
}
