/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalOptions, Terminal } from "@theia/plugin";
import { TerminalMain, TempTermStub } from "../../api/plugin-api";
import { TerminalFrontendContribution } from "@theia/terminal/lib/browser/terminal-frontend-contribution.js";
// import { RPCProtocol } from "../../api/rpc-protocol";
import { interfaces } from "inversify";

export class TerminalMainImpl implements TerminalMain {

    private readonly terminalFrontentContribution: TerminalFrontendContribution;

    constructor(container: interfaces.Container
        // private readonly rpc: RPCProtocol
    ) {
        this.terminalFrontentContribution = container.get(TerminalFrontendContribution);
    }

    // $createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal;
    // $createTerminal(options: TerminalOptions): Terminal;
    $createTerminal(nameOrOption?: TerminalOptions, shellPath?: string, shellArgs?: string): Terminal {
        this.terminalFrontentContribution.newTerminal();
        return new TempTermStub();
    }
}
