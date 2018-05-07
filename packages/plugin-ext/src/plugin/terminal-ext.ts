/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Terminal, TerminalOptions } from "@theia/plugin";
import { TerminalServiceExt, TerminalServiceMain, PLUGIN_RPC_CONTEXT, TerminalMain } from "../api/plugin-api";
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
        const terminalMain = typeof nameOrOptions === 'object' ? this.proxy.$createTerminal(nameOrOptions) :
                                                                 this.proxy.$createTerminal(nameOrOptions, shellPath, shellArgs);
        return new TerminalImpl(terminalMain);
    }
}

export class TerminalImpl implements Terminal {

    constructor(private readonly terminalMain: TerminalMain) {}

    sendText(text: string, addNewLine?: boolean | undefined): void {
        this.terminalMain.$sendText(text, addNewLine);
    }
    show(preserveFocus?: boolean | undefined): void {
        this.terminalMain.$show();
    }
    hide(): void {
        this.terminalMain.$hide();
    }
    dispose(): void {
        this.terminalMain.$dispose();
    }
}
