/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Terminal, TerminalOptions } from "@theia/plugin";
import { TerminalServiceExt, TerminalServiceMain, PLUGIN_RPC_CONTEXT } from "../api/plugin-api";
import { RPCProtocol } from "../api/rpc-protocol";

export class TerminalServiceExtImpl implements TerminalServiceExt {

    private readonly proxy: TerminalServiceMain;

    constructor(rpc: RPCProtocol) {
        this.proxy = rpc.getProxy(PLUGIN_RPC_CONTEXT.TERMINAL_MAIN);
    }

    $createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal; // todo do we need $ here?
    $createTerminal(options: TerminalOptions): Terminal;
    $createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]): Terminal {
        return this.createTerminal(nameOrOptions, shellPath, shellArgs);
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

        const terminal = new TerminalExtImpl(this.proxy, options.name || "test"); // todo autogenerate terminal name if it's was not defined
        terminal.create(options, shellPath, shellArgs);
        return terminal;
    }
}

export class TerminalExtImpl implements Terminal {

    processId: Thenable<number>;

    constructor(private readonly proxy: TerminalServiceMain, readonly name: string) {}

    create(nameOrOptions: TerminalOptions, shellPath?: string, shellArgs?: string[]): void {
        this.processId = this.proxy.$createTerminal(nameOrOptions);
    }

    sendText(text: string, addNewLine?: boolean | undefined): void {
        this.processId.then(id => this.proxy.$sendText(id, text, addNewLine));
    }

    show(preserveFocus?: boolean | undefined): void {
        this.processId.then(id => this.proxy.$show(id));
    }

    hide(): void {
        this.processId.then(id => this.proxy.$hide(id));
    }

    dispose(): void {
        this.processId.then(id => this.proxy.$dispose(id));
    }
}
