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

export interface PluginHost {
    loadPlugin(plugin: Plugin): void;

    stopPlugins(): void;
}

export class HostedPluginManagerExtImpl implements HostedPluginManagerExt {

    constructor(private readonly host: PluginHost) {
    }

    $loadPlugin(plugin: Plugin): void {
        this.host.loadPlugin(plugin);
    }

    $stopPlugin(): PromiseLike<void> {
        this.host.stopPlugins();
        return Promise.resolve();
    }

}
