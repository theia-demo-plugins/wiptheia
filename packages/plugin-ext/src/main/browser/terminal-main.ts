/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TerminalOptions } from "@theia/plugin";
import { TerminalServiceMain, TerminalMain, } from "../../api/plugin-api";
import { interfaces } from "inversify";
import { TerminalService } from "@theia/core/lib/browser/terminal/terminal-service";
import { TerminalWidget } from "@theia/core/lib/browser/terminal/terminal-model";
import { Deferred } from "@theia/core/lib/common/promise-util";

export class TerminalServiceMainImpl implements TerminalServiceMain {

    private readonly terminalService: TerminalService;

    constructor(container: interfaces.Container) {
        this.terminalService = container.get(TerminalService);
    }

    $createTerminal(nameOrOptions: TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]): TerminalMain {
        if (typeof nameOrOptions === "object") {
            return new TerminalMainImpl(nameOrOptions, this.terminalService);
        }
        const options = {
            name: nameOrOptions,
            shellPath: shellPath,
            shellArgs: shellArgs
        };
        return new TerminalMainImpl(options, this.terminalService);
    }
}

export class TerminalMainImpl implements TerminalMain {

    private readonly waitForCreateTerminal = new Deferred<TerminalWidget>();

    constructor(private readonly options: TerminalOptions, private readonly terminalService: TerminalService) {
    }

    create(): void {
        this.terminalService.newTerminal(this.options).then(termWidget => {
            this.waitForCreateTerminal.resolve();
        });
    }

    $show(preserveFocus?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }

    $sendText(text: string, addNewLine?: boolean | undefined): void {
        this.waitForCreateTerminal.promise.then(widget => {
            widget.sendText(text, addNewLine);
        });
    }

    $hide(): void {
        throw new Error("Method not implemented.");
    }

    $dispose(): void {
        this.waitForCreateTerminal.promise.then(widget => {
            widget.dispose();
        });
    }
}
