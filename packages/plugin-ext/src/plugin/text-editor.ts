/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { TextEditor, ViewColumn, TextEditorOptions } from "@theia/plugin";
import { TextEditorConfiguration, TextEditorsMain } from "../api/plugin-api";
import { Selection, Range } from "./types-impl";
import { DocumentDataExt } from "./document-data";

export class TextEditorExt implements TextEditor {

    constructor(
        proxy: TextEditorsMain,
        id: string,
        document: DocumentDataExt,
        selections: Selection[],
        options: TextEditorOptions,
        visibleRanges: Range[],
        viewColumn: ViewColumn | undefined) {
    }

    private _viewColumn: ViewColumn;

    get viewColumn(): ViewColumn {
        return this._viewColumn;
    }

    acceptViewColumn(val: ViewColumn): void {
        this._viewColumn = val;
    }

    dispose(): void {
        // TODO: implement this
    }

    acceptOptions(options: TextEditorConfiguration): void {
        throw new Error("Method not implemented.");
    }

    acceptSelections(selections: Selection[]): void {
        // throw new Error("Method not implemented.");
    }

    acceptVisibleRanges(range: Range[]): void {
        // throw new Error("Method not implemented.");
    }
}
