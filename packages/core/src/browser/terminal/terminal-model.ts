/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Terminal model describes interfaces for creation and using terminal widget even without defining server side connection.
 * Terminal widget can be created from external externsion and can be attached to another Theia widgets which
 * support adding external widgets.
 */

export interface TerminalOptions {

    readonly name?: string;

    readonly shellPath?: string;

    readonly shellArgs?: string[];

    readonly cwd?: string;

    readonly env?: { [key: string]: string | null };
}

export const TerminalWidget = Symbol("TerminalWidget");
export interface TerminalWidget {
    start(id?: number): Promise<void>;
    dispose(): void;
}
