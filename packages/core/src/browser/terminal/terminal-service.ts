/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { TerminalOptions, TerminalWidget } from "./terminal-model";

export const TerminalService = Symbol("TerminalService");
export interface TerminalService {
    newTerminal(options: TerminalOptions): Promise<TerminalWidget>;
    activateWidget(termWidget: TerminalWidget): void;
    collapseWidget(termWidget: TerminalWidget): void;
}
