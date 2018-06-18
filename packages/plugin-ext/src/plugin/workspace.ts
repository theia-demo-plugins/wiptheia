/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { WorkspaceFoldersChangeEvent } from "@theia/plugin";
import { Event, Emitter } from "@theia/core/lib/common/event";
import { WorkspaceExt } from "../api/plugin-api";
import { RPCProtocol } from "../api/rpc-protocol";

export class WorkspaceExtImpl implements WorkspaceExt {

    private workspaceFoldersChangedEmitter = new Emitter<WorkspaceFoldersChangeEvent>();
    public readonly onDidChangeWorkspaceFolders: Event<WorkspaceFoldersChangeEvent> = this.workspaceFoldersChangedEmitter.event;

    constructor(rpc: RPCProtocol) {
        console.log(">> creating WorkspaceExtImpl !!!!");
    }

    $onWorkspaceFoldersChanged(event: WorkspaceFoldersChangeEvent): void {
        console.log(">> onWorkspaceFoldersChanged " + event);

        console.log("<< added " + event.added);
        console.log("<< removed " + event.removed);

        this.workspaceFoldersChangedEmitter.fire(event);
    }

}
