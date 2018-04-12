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
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { injectable } from "inversify";
import * as express from 'express';
import * as fs from 'fs';
import { PluginModel, PluginPackage } from '../common/plugin-protocol';
import { resolve } from 'path';

@injectable()
export class HostedPluginReader implements BackendApplicationContribution {
    private plugin: PluginModel | undefined;
    private pluginPath: string;

    initialize(): void {
        if (process.env.HOSTED_PLUGIN) {
            let pluginPath = process.env.HOSTED_PLUGIN;
            if (pluginPath) {
                if (!pluginPath.endsWith('/')) {
                    pluginPath += '/';
                }
                this.pluginPath = pluginPath;
                this.handlePlugin(pluginPath);
            }
        }
    }

    configure(app: express.Application): void {
        app.get('/hostedPlugin/:path(*)', (req, res) => {
            const filePath: string = req.params.path;
            res.sendFile(this.pluginPath + filePath);
        });
    }

    private handlePlugin(path: string): void {
        if (!path.endsWith('/')) {
            path += '/';
        }
        const packageJsonPath = path + 'package.json';
        if (fs.existsSync(packageJsonPath)) {
            const plugin: PluginPackage = require(packageJsonPath);

            // TODO inject PluginMetadata and parse package.json
            this.plugin = {} as PluginModel;

            if (this.plugin.entryPoint.backend) {
                this.plugin.entryPoint.backend = resolve(path, this.plugin.entryPoint.backend);
            }
        } else {
            this.plugin = undefined;
        }
    }

    getPlugin(): PluginModel | undefined {
        return this.plugin;
    }
}
