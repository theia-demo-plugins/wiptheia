/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalOptions } from "@theia/plugin";
import { TerminalServiceMain, TerminalServiceExt, MAIN_RPC_CONTEXT } from "../../api/plugin-api";
import { interfaces } from "inversify";
import { TerminalService } from "@theia/core/lib/browser/terminal/terminal-service";
import { TerminalWidget } from "@theia/core/lib/browser/terminal/terminal-model";
import { RPCProtocol } from "../../api/rpc-protocol";
import { Disposable } from "@theia/core/lib/common/disposable";

export class TerminalDisposable implements Disposable {

    constructor(private readonly proxy: TerminalServiceExt, private readonly terminalId: number) { }

    dispose(): void {
        this.proxy.$terminalClosed(this.terminalId);
    }
}

export class TerminalServiceMainImpl implements TerminalServiceMain {

    private readonly terminalService: TerminalService;
    protected readonly terminals = new Map<number, TerminalWidget>();
    private readonly extProxy: TerminalServiceExt;

    constructor(container: interfaces.Container, rpc: RPCProtocol) {
        this.terminalService = container.get(TerminalService);
        this.extProxy = rpc.getProxy(MAIN_RPC_CONTEXT.TERMINAL_EXT);
    }

    async $createTerminal(options: TerminalOptions, shellPath?: string, shellArgs?: string[]): Promise<number> {
        const terminalWidget = await this.terminalService.newTerminal(options);
        let id = await terminalWidget.createTerminal();
        if (id) {
            this.terminals.set(id, terminalWidget);
            terminalWidget.onDidClosed(new TerminalDisposable(this.extProxy, id));
        } else {
            id = -1;
        }
        return id;
    }

    $sendText(id: number, text: string, addNewLine?: boolean | undefined): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            termWidget.sendText(text, addNewLine);
        }
    }

    $show(id: number, preserveFocus?: boolean | undefined): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            this.terminalService.activateWidget(termWidget);
        }
    }

    $hide(id: number): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            this.terminalService.collapseWidget(termWidget);
        }
    }

    $dispose(id: number): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            termWidget.dispose();
        }
    }
}
