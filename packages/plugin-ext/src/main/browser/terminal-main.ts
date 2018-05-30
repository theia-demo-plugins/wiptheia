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
import { TerminalWidget, TerminalWidgetOptions } from "@theia/core/lib/browser/terminal/terminal-model";
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
    private terminalNumber = 0;
    private readonly TERM_ID_PREFIX = "plugin-terminal-";

    constructor(container: interfaces.Container, rpc: RPCProtocol) {
        this.terminalService = container.get(TerminalService);
        this.extProxy = rpc.getProxy(MAIN_RPC_CONTEXT.TERMINAL_EXT);
    }

    $createTerminal(options: TerminalOptions): Promise<number> {
        const counter = this.terminalNumber++;
        const termWidgetOptions: TerminalWidgetOptions = {
            title: options.name,
            shellPath: options.shellPath,
            shellArgs: options.shellArgs,
            cwd: options.cwd,
            env: options.env,
            destroyTermOnClose: true,
            overrideTitle: false,
            id: this.TERM_ID_PREFIX + counter
        };
        return new Promise<number>((resolve, reject) => {
            this.terminalService.newTerminal(termWidgetOptions)
            .then(termWidget => {
                termWidget.start()
                .then(id => {
                    if (id) {
                        this.terminals.set(id, termWidget);
                        termWidget.onDidClosed(new TerminalDisposable(this.extProxy, id));
                    }
                    resolve(id);
                })
                .catch(err => {
                    console.log("Failed to start terminal");
                    reject(err);
                });
            })
            .catch(err => {
                console.log("Failed to create terminal widget with predefined options ", err);
                reject(err);
            });
        });
    }

    $sendText(id: number, text: string, addNewLine?: boolean): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            text = text.replace(/\r?\n/g, '\r');
            if (addNewLine && text.charAt(text.length - 1) !== '\r') {
                text += '\r';
            }
            termWidget.sendText(text);
        }
    }

    $show(id: number, preserveFocus?: boolean): void {
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
