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

import {injectable} from 'inversify';
import {apiType, PluginModel, PluginPackage} from '../common/plugin-protocol';

export interface PluginScanner {
    parse(plugin: PluginPackage): PluginModel;
}

class TheiaPluginScanner implements PluginScanner {
    private apiType: apiType = 'theiaPlugin';

    parse(plugin: PluginPackage): PluginModel {
        return {
            name: plugin.name,
            publisher: plugin.publisher,
            version: plugin.version,
            displayName: plugin.displayName,
            description: plugin.description,
            engine: {
                type: this.apiType,
                version: plugin.engines[this.apiType]
            },
            entryPoint: {
                frontend: plugin.theiaPlugin!.worker,
                backend: plugin.theiaPlugin!.node
            }
        };
    }
}

class VSCodePluginScanner implements PluginScanner {
    private apiType: apiType = 'vscode';

    parse(plugin: PluginPackage): PluginModel {
        return {
            name: plugin.name,
            publisher: plugin.publisher,
            version: plugin.version,
            displayName: plugin.displayName,
            description: plugin.description,
            engine: {
                type: this.apiType,
                version: plugin.engines[this.apiType]
            },
            entryPoint: {
                backend: plugin.main
            }
        };
    }
}

@injectable()
export class PluginMetadata {
    private theiaPluginScanner = new TheiaPluginScanner();
    private vscodePluginScanner = new VSCodePluginScanner();

    public getQualifiedName(plugin: PluginPackage): string {
        return `${plugin.publisher}.${plugin.name}-${plugin.version}`;
    }

    public getPluginType(plugin: PluginPackage): apiType {
        return plugin.engines.theiaPlugin !== undefined ? 'theiaPlugin' : 'vscode';
    }

    public getPluginScanner(apiType: apiType): PluginScanner {
        if (apiType === 'theiaPlugin') {
            return this.theiaPluginScanner;
        } else {
            return this.vscodePluginScanner;
        }
    }
    public getPluginModel(plugin: PluginPackage): PluginModel {
        const apiType = this.getPluginType(plugin);
        const scanner = this.getPluginScanner(apiType);
        return scanner.parse(plugin);
    }
}
