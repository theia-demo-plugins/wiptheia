/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { EventEmitter, Terminal, TerminalOptions } from "@theia/plugin";
import { TerminalServiceExt, TerminalServiceMain, PLUGIN_RPC_CONTEXT } from "../api/plugin-api";
import { RPCProtocol } from "../api/rpc-protocol";
import { Emitter, Event } from "@theia/core/lib/common/event";

export class TerminalServiceExtImpl implements TerminalServiceExt {

    private readonly proxy: TerminalServiceMain;
    private readonly _onDidCloseTerminal: EventEmitter<Terminal> = new Emitter<Terminal>();
    private readonly terminals: Map<number, Terminal> = new Map();

    constructor(rpc: RPCProtocol) {
        this.proxy = rpc.getProxy(PLUGIN_RPC_CONTEXT.TERMINAL_MAIN);
    }

    createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]): Terminal {
        let options: TerminalOptions;
        if (typeof nameOrOptions === "object") {
            options = nameOrOptions;
        } else {
            options = {
                name: nameOrOptions,
                shellPath: shellPath,
                shellArgs: shellArgs
            };
        }

        const terminal = new TerminalExtImpl(this.proxy, options.name || "Terminal");
        terminal.create(options, shellPath, shellArgs);
        terminal.processId.then(id => {
            this.terminals.set(id, terminal);
        });
        return terminal;
    }

    $terminalClosed(id: number): void {
        const terminal = this.terminals.get(id);
        if (terminal) {
            this._onDidCloseTerminal.fire(terminal);
        }
    }

    public set onDidCloseTerminal(event: Event<Terminal>) {
        this._onDidCloseTerminal.event = event;
    }

    public get onDidCloseTerminal(): Event<Terminal> {
        return this._onDidCloseTerminal && this._onDidCloseTerminal.event;
    }
}

export class TerminalExtImpl implements Terminal {

    _processId: Thenable<number>;

    constructor(private readonly proxy: TerminalServiceMain, readonly name: string) { }

    create(nameOrOptions: TerminalOptions, shellPath?: string, shellArgs?: string[]): void {
        this._processId = this.proxy.$createTerminal(nameOrOptions);
    }

    sendText(text: string, addNewLine?: boolean): void {
        this._processId.then(id => this.proxy.$sendText(id, text, addNewLine));
    }

    show(preserveFocus?: boolean): void {
        this._processId.then(id => this.proxy.$show(id));
    }

    hide(): void {
        this._processId.then(id => this.proxy.$hide(id));
    }

    dispose(): void {
        this._processId.then(id => this.proxy.$dispose(id));
    }

    public get processId(): Thenable<number> {
        return this._processId;
    }
}
