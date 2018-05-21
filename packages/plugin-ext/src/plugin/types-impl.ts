/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export class Disposable {
    private disposable: undefined | (() => void);

    constructor(func: () => void) {
        this.disposable = func;
    }
    /**
     * Dispose this object.
     */
    dispose(): void {
        if (this.disposable) {
            this.disposable();
            this.disposable = undefined;
        }
    }

    static create(func: () => void): Disposable {
        return new Disposable(func);
    }
}

export enum TextEditorLineNumbersStyle {
    Off = 0,
    On = 1,
    Relative = 2
}

export interface UriComponents {
    scheme: string;
    authority: string;
    path: string;
    query: string;
    fragment: string;
}

/**
 * Denotes a column in the editor window.
 * Columns are used to show editors side by side.
 */
export enum ViewColumn {
    Active = -1,
    One = 1,
    Two = 2,
    Three = 3
}

/**
 * Represents sources that can cause `window.onDidChangeEditorSelection`
 */
export enum TextEditorSelectionChangeKind {
    Keyboard = 1,

    Mouse = 2,

    Command = 3
}

export namespace TextEditorSelectionChangeKind {
    export function fromValue(s: string | undefined) {
        switch (s) {
            case 'keyboard': return TextEditorSelectionChangeKind.Keyboard;
            case 'mouse': return TextEditorSelectionChangeKind.Mouse;
            case 'api': return TextEditorSelectionChangeKind.Command;
        }
        return undefined;
    }
}

export class Position {
    // TODO:
    constructor(line: number, char: number) {

    }
}

export class Range {
    // TODO:
    constructor(start: Position, end: Position);
    constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
    constructor(startLineOrStart: number | Position, startColumnOrEnd: number | Position, endLine?: number, endColumn?: number) {

    }
}

export class Selection extends Range {
    // TODO:
    constructor(start: Position, end: Position) {
        super(start, end);
    }
}
