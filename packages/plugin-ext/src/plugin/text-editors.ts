/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TextEditorsExt, EditorChangedPropertiesData, TextEditorPositionData } from "../api/plugin-api";
import { RPCProtocol } from "../api/rpc-protocol";
import * as theia from '@theia/plugin';
import { Emitter, Event } from '@theia/core/lib/common/event';
import { EditorsAndDocumentsExtImpl } from "./editors-and-documents";
import { TextEditorExt } from "./text-editor";
import * as Converters from './type-converters';
import { TextEditorSelectionChangeKind } from "./types-impl";

export class TextEditorsExtImpl implements TextEditorsExt {

    private readonly _onDidChangeTextEditorSelection = new Emitter<theia.TextEditorSelectionChangeEvent>();
    private readonly _onDidChangeTextEditorOptions = new Emitter<theia.TextEditorOptionsChangeEvent>();
    private readonly _onDidChangeTextEditorVisibleRanges = new Emitter<theia.TextEditorVisibleRangesChangeEvent>();
    private readonly _onDidChangeTextEditorViewColumn = new Emitter<theia.TextEditorViewColumnChangeEvent>();
    private readonly _onDidChangeActiveTextEditor = new Emitter<theia.TextEditor | undefined>();
    private readonly _onDidChangeVisibleTextEditors = new Emitter<theia.TextEditor[]>();

    readonly onDidChangeTextEditorSelection: Event<theia.TextEditorSelectionChangeEvent> = this._onDidChangeTextEditorSelection.event;
    readonly onDidChangeTextEditorOptions = this._onDidChangeTextEditorOptions.event;
    readonly onDidChangeTextEditorVisibleRanges = this._onDidChangeTextEditorVisibleRanges.event;
    readonly onDidChangeTextEditorViewColumn = this._onDidChangeTextEditorViewColumn.event;
    readonly onDidChangeActiveTextEditor = this._onDidChangeActiveTextEditor.event;
    readonly onDidChangeVisibleTextEditors = this._onDidChangeVisibleTextEditors.event;

    // private proxy: TextEditorsMain;

    constructor(rpc: RPCProtocol, private editorsAndDocuments: EditorsAndDocumentsExtImpl) {
        // this.proxy = rpc.getProxy(PLUGIN_RPC_CONTEXT.TEXT_EDITORS_MAIN);

        this.editorsAndDocuments.onDidChangeActiveTextEditor(e => this._onDidChangeActiveTextEditor.fire(e));
        this.editorsAndDocuments.onDidChangeVisibleTextEditors(e => this._onDidChangeVisibleTextEditors.fire(e));
    }
    $acceptEditorPropertiesChanged(id: string, props: EditorChangedPropertiesData): void {
        const textEditor = this.editorsAndDocuments.getEditor(id);
        if (!textEditor) {
            return;
        }

        if (props.options) {
            textEditor.acceptOptions(props.options);
        }
        if (props.selections) {
            const selections = props.selections.selections.map(Converters.toSelection);
            textEditor.acceptSelections(selections);
        }

        if (props.visibleRanges) {
            const visibleRanges = props.visibleRanges.map(Converters.toRange);
            textEditor.acceptVisibleRanges(visibleRanges);
        }

        if (props.options) {
            this._onDidChangeTextEditorOptions.fire({
                textEditor,
                options: props.options
            });
        }

        if (props.selections) {
            const kind = TextEditorSelectionChangeKind.fromValue(props.selections.source);
            const selections = props.selections.selections.map(Converters.toSelection);
            this._onDidChangeTextEditorSelection.fire({
                textEditor,
                selections,
                kind
            });
        }

        if (props.visibleRanges) {
            const visibleRanges = props.visibleRanges.map(Converters.toRange);
            this._onDidChangeTextEditorVisibleRanges.fire({
                textEditor,
                visibleRanges
            });
        }
    }
    $acceptEditorPositionData(data: TextEditorPositionData): void {
        for (const id in data) {
            if (data.hasOwnProperty(id)) {
                const textEditor = this.editorsAndDocuments.getEditor(id);
                const viewColumn = Converters.toViewColumn(data[id]);
                if (textEditor && viewColumn) {
                    if (textEditor.viewColumn !== viewColumn) {
                        textEditor.acceptViewColumn(viewColumn);
                        this._onDidChangeTextEditorViewColumn.fire({ textEditor, viewColumn });
                    }
                }
            }
        }
    }

    getActiveEditor(): TextEditorExt | undefined {
        return this.editorsAndDocuments.activeEditor();
    }

    getVisibleTextEditors(): theia.TextEditor[] {
        return this.editorsAndDocuments.allEditors();
    }

}
