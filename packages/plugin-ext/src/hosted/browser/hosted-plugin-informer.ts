/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject, postConstruct } from 'inversify';
import { StatusBar } from '@theia/core/lib/browser/status-bar/status-bar';
import { StatusBarAlignment, StatusBarEntryStyle, StatusBarEntry } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { HostedPluginServer } from '../../common/plugin-protocol';
import { ConnectionStatusService, ConnectionState } from '@theia/core/lib/browser/connection-status-service';
import URI from '@theia/core/lib/common/uri';
import { FileStat } from '@theia/filesystem/lib/common';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';

@injectable()
export class HostedPluginInformer {

    public static readonly DEVELOPMENT_HOST = "Developement Host";

    private entry: StatusBarEntry;

    @inject(StatusBar)
    protected readonly statusBar: StatusBar;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(HostedPluginServer)
    protected readonly hostedPluginServer: HostedPluginServer;

    @inject(ConnectionStatusService)
    protected readonly connectionStatusService: ConnectionStatusService;

    @inject(FrontendApplicationStateService)
    protected readonly frontendApplicationStateService: FrontendApplicationStateService;

    @postConstruct()
    protected async init(): Promise<void> {
        this.workspaceService.root.then(root => {
            this.hostedPluginServer.getHostedPlugin().then(pluginMetadata => {
                if (pluginMetadata) {
                    this.entry = {
                        text: `$(cube) ` + HostedPluginInformer.DEVELOPMENT_HOST,
                        tooltip: `Hosted Plugin '` + pluginMetadata.model.name + `'`,
                        alignment: StatusBarAlignment.LEFT,
                        priority: 100
                    };

                    this.frontendApplicationStateService.reachedState('init').then(() => {
                        this.updateStatusBarElement();
                        this.updateTitle(root);
                    });

                    this.connectionStatusService.onStatusChange(() => this.updateStatusBarElement());
                }
            });
        });
    }

    private updateStatusBarElement(): void {
        if (this.connectionStatusService.currentState.state === ConnectionState.OFFLINE) {
            this.entry.style = StatusBarEntryStyle.ERROR;
        } else {
            this.entry.style = StatusBarEntryStyle.SUCCESS;
        }

        this.statusBar.setElement('development-host', this.entry);
    }

    private updateTitle(root: FileStat | undefined): void {
        if (root) {
            const uri = new URI(root.uri);
            document.title = HostedPluginInformer.DEVELOPMENT_HOST + " - " + uri.displayName;
        } else {
            document.title = HostedPluginInformer.DEVELOPMENT_HOST;
        }
    }

}
