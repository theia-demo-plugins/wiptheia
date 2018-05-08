/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalOptions } from "@theia/plugin";
import { TerminalServiceMain} from "../../api/plugin-api";
import { interfaces } from "inversify";
import { TerminalService } from "@theia/core/lib/browser/terminal/terminal-service";
import { TerminalWidget } from "@theia/core/lib/browser/terminal/terminal-model";

export class TerminalServiceMainImpl implements TerminalServiceMain {

    private readonly terminalService: TerminalService;
    protected readonly terminals = new Map<number, TerminalWidget>();

    constructor(container: interfaces.Container) {
        this.terminalService = container.get(TerminalService);
        console.log(this.terminalService);
    }

    async $createTerminal(options: TerminalOptions, shellPath?: string, shellArgs?: string[]): Promise<number> {
        const terminalWidget = await this.terminalService.newTerminal(options);
        let id = await terminalWidget.createTerminal();
        if (id) {
            this.terminals.set(id, terminalWidget);
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
        throw new Error("Method not implemented.");
    }

    $hide(id: number): void {
        throw new Error("Method not implemented.");
    }

    $dispose(id: number): void {
        const termWidget = this.terminals.get(id);
        if (termWidget) {
            termWidget.dispose();
        }
    }
}
