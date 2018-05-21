/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TextEditorsMain, MAIN_RPC_CONTEXT, TextEditorsExt } from "../../api/plugin-api";
import { EditorsAndDocumentsMain } from "./editors-and-documents-main";
import { RPCProtocol } from "../../api/rpc-protocol";
import { DisposableCollection } from "@theia/core";
import { TextEditorMain } from "./text-editor-main";

export class TextEditorsMainImpl implements TextEditorsMain {
    private toDispose = new DisposableCollection();
    private proxy: TextEditorsExt;
    private editorsToDispose = new Map<string, DisposableCollection>();
    constructor(editorsAndDocuments: EditorsAndDocumentsMain, rpc: RPCProtocol) {
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
}
