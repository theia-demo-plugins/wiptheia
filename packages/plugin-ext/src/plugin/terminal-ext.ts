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

    $createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal;
    $createTerminal(options: TerminalOptions): Terminal;
    $createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]) {
        return this.createTerminal(nameOrOptions, shellPath, shellArgs);
    }

    createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]) {
        if (typeof nameOrOptions === 'object') {
            return this.proxy.$createTerminal(nameOrOptions);
        }
        return this.proxy.$createTerminal(nameOrOptions, shellPath, shellArgs);
    }
}
