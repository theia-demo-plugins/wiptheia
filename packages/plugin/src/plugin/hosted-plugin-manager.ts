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
import { HostedPluginManagerExt, Plugin } from '../api/plugin-api';
import { getPluginId } from '../common/plugin-protocol';

export interface PluginHost {
    initialize(contextPath: string): void;

    loadPlugin(plugin: Plugin): void;

    stopPlugins(pluginIds: string[]): void;
}

export class HostedPluginManagerExtImpl implements HostedPluginManagerExt {

    private runningPluginIds: string[];

    constructor(private readonly host: PluginHost) {
        this.runningPluginIds = [];
    }

    $initialize(contextPath: string): void {
        this.host.initialize(contextPath);
    }

    $loadPlugin(plugin: Plugin): void {
        this.runningPluginIds.push(getPluginId(plugin.model));
        this.host.loadPlugin(plugin);
    }

    $stopPlugin(): PromiseLike<void> {
        this.host.stopPlugins(this.runningPluginIds);
        return Promise.resolve();
    }

}
