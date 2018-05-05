/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalOptions, Terminal } from "@theia/plugin";
import { TerminalServiceMain, TerminalMain, } from "../../api/plugin-api";
import { interfaces } from "inversify";
import { TerminalService } from "@theia/core/lib/browser/terminal/terminal-service";

export class TerminalServiceMainImpl implements TerminalServiceMain {

    private readonly terminalService: TerminalService;

    constructor(container: interfaces.Container) {
        this.terminalService = container.get(TerminalService);
    }

    $createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]): Terminal {
        if (typeof nameOrOptions === "object") {
            return new TerminalMainImpl(nameOrOptions, this.terminalService);
        }
        const options = {
            name: nameOrOptions,
            shellPath: shellPath,
            shellArgs: shellArgs
        }
        return new TerminalMainImpl(options, this.terminalService);
    }
}

export class TerminalMainImpl implements TerminalMain, Terminal {

    // name: string;
    // processId: Thenable<number>;

    constructor(private readonly options: TerminalOptions, private readonly terminalService: TerminalService) {

    }

    sendText(text: string, addNewLine?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }
    show(preserveFocus?: boolean | undefined): void {
        this.$show(preserveFocus);
    }
    hide(): void {
        throw new Error("Method not implemented.");
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }

    $show(preserveFocus?: boolean | undefined): void {
        const termWidget = this.terminalService.newTerminal(this.options);
    }

    $sendText(text: string, addNewLine?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }

    $hide(): void {
        throw new Error("Method not implemented.");
    }

    $dispose(): void {
        throw new Error("Method not implemented.");
    }
}
