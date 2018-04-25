/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable, inject } from 'inversify';
import { HostedPluginServer, HostedPluginClient, PluginMetadata } from '../../common/plugin-protocol';
import { HostedPluginReader } from './plugin-reader';
import { HostedPluginManager } from './hosted-plugin-manager';
import { HostedPluginSupport } from './hosted-plugin';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class HostedPluginServerImpl implements HostedPluginServer {

    constructor(
        @inject(HostedPluginReader) private readonly reader: HostedPluginReader,
        @inject(HostedPluginSupport) private readonly hostedPlugin: HostedPluginSupport,
        @inject(HostedPluginManager) protected readonly hostedPluginManager: HostedPluginManager) {
    }

    dispose(): void {
        this.hostedPlugin.clientClosed();
    }
    setClient(client: HostedPluginClient): void {
        this.hostedPlugin.setClient(client);
    }
    getHostedPlugin(): Promise<PluginMetadata | undefined> {
        const pluginMetadata = this.reader.getPlugin();
        if (pluginMetadata) {
            this.hostedPlugin.runPlugin(pluginMetadata.model);
        }
        return Promise.resolve(this.reader.getPlugin());
    }

    onMessage(message: string): Promise<void> {
        this.hostedPlugin.onMessage(message);
        return Promise.resolve();
    }

    isPluginValid(uri: string): Promise<boolean> {
        return Promise.resolve(this.hostedPluginManager.isPluginValid(new URI(uri)));
    }

    runHostedPluginInstance(uri: string): Promise<string> {
        return this.uriToStrPromise(this.hostedPluginManager.run(new URI(uri)));
    }

    terminateHostedPluginInstance(): Promise<void> {
        return Promise.resolve(this.hostedPluginManager.terminate());
    }

    isHostedTheiaRunning(): Promise<boolean> {
        return Promise.resolve(this.hostedPluginManager.isRunning());
    }

    getHostedPluginInstanceURI(): Promise<string> {
        return Promise.resolve(this.hostedPluginManager.getInstanceURI().toString());
    }

    protected uriToStrPromise(promise: Promise<URI>): Promise<string> {
        return new Promise((resolve, reject) => {
            promise.then((uri: URI) => {
                resolve(uri.toString());
            }).catch(error => reject(error));
        });
    }

}
