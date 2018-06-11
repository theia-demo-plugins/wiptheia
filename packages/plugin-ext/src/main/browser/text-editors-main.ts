/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import {
    Range,
    TextEditorsMain,
    MAIN_RPC_CONTEXT,
    TextEditorsExt,
    TextEditorConfigurationUpdate,
    Selection,
    TextEditorRevealType,
    SingleEditOperation,
    ApplyEditsOptions,
    UndoStopOptions,
    DecorationRenderOptions,
    DecorationOptions
} from "../../api/plugin-api";
import { EditorsAndDocumentsMain } from "./editors-and-documents-main";
import { RPCProtocol } from "../../api/rpc-protocol";
import { DisposableCollection } from "@theia/core";
import { TextEditorMain } from "./text-editor-main";
import { disposed } from "../../common/errors";

export class TextEditorsMainImpl implements TextEditorsMain {

    private toDispose = new DisposableCollection();
    private proxy: TextEditorsExt;
    private editorsToDispose = new Map<string, DisposableCollection>();
    constructor(private readonly editorsAndDocuments: EditorsAndDocumentsMain, rpc: RPCProtocol) {
        this.proxy = rpc.getProxy(MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT);
        this.toDispose.push(editorsAndDocuments.onTextEditorAdd(editors => editors.forEach(this.onTextEditorAdd, this)));
        this.toDispose.push(editorsAndDocuments.onTextEditorRemove(editors => editors.forEach(this.onTextEditorRemove, this)));
    }

    dispose(): void {
        this.editorsToDispose.forEach(val => val.dispose());
        this.editorsToDispose = new Map();
        this.toDispose.dispose();
    }

    private onTextEditorAdd(editor: TextEditorMain): void {
        const id = editor.getId();
        const toDispose = new DisposableCollection();
        toDispose.push(editor.onPropertiesChangedEvent(e => {
            this.proxy.$acceptEditorPropertiesChanged(id, e);
        }));
        this.editorsToDispose.set(id, toDispose);
    }

    private onTextEditorRemove(id: string): void {
        const disposables = this.editorsToDispose.get(id);
        if (disposables) {
            disposables.dispose();
        }
        this.editorsToDispose.delete(id);
    }

    $trySetOptions(id: string, options: TextEditorConfigurationUpdate): Promise<void> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id)!.setConfiguration(options);
        return Promise.resolve();
    }

    $trySetSelections(id: string, selections: Selection[]): Promise<void> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor: ${id}`));
        }
        this.editorsAndDocuments.getEditor(id)!.setSelections(selections);
        return Promise.resolve();
    }

    $tryRevealRange(id: string, range: Range, revealType: TextEditorRevealType): Promise<void> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor(${id})`));
        }

        this.editorsAndDocuments.getEditor(id)!.revealRange(new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn), revealType);
        return Promise.resolve();
    }

    $tryApplyEdits(id: string, modelVersionId: number, edits: SingleEditOperation[], opts: ApplyEditsOptions): Promise<boolean> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor(${id})`));
        }

        return Promise.resolve(this.editorsAndDocuments.getEditor(id)!.applyEdits(modelVersionId, edits, opts));
    }

    $tryInsertSnippet(id: string, template: string, ranges: Range[], opts: UndoStopOptions): Promise<boolean> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor(${id})`));
        }
        return Promise.resolve(this.editorsAndDocuments.getEditor(id)!.insertSnippet(template, ranges, opts));
    }

    $registerTextEditorDecorationType(key: string, options: DecorationRenderOptions): void {
        monaco.services.StaticServices.codeEditorService.get().registerDecorationType(key, options);
    }

    $removeTextEditorDecorationType(key: string): void {
        monaco.services.StaticServices.codeEditorService.get().removeDecorationType(key);
    }

    $trySetDecorations(id: string, key: string, ranges: DecorationOptions[]): Promise<void> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id)!.setDecorations(key, ranges);
        return Promise.resolve();
    }

    $trySetDecorationsFast(id: string, key: string, ranges: number[]): Promise<void> {
        if (!this.editorsAndDocuments.getEditor(id)) {
            return Promise.reject(disposed(`TextEditor(${id})`));
        }
        this.editorsAndDocuments.getEditor(id)!.setDecorationsFast(key, ranges);
        return Promise.resolve();
    }
}
