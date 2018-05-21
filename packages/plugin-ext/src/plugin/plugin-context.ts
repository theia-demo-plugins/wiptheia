/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import * as theia from '@theia/plugin';
import { CommandRegistryImpl } from './command-registry';
import { Emitter } from '@theia/core/lib/common/event';
import { CancellationTokenSource } from '@theia/core/lib/common/cancellation';
import { QuickOpenExtImpl } from './quick-open';
import { MAIN_RPC_CONTEXT, Plugin } from '../api/plugin-api';
import { RPCProtocol } from '../api/rpc-protocol';
import { getPluginId } from '../common/plugin-protocol';
import { MessageRegistryExt } from './message-registry';
import { Disposable, Position, Range, Selection, ViewColumn, TextEditorSelectionChangeKind } from './types-impl';
import { EditorsAndDocumentsExtImpl } from './editors-and-documents';
import { TextEditorsExtImpl } from './text-editors';
import { DocumentsExtImpl } from './documents';

export function createAPI(rpc: RPCProtocol): typeof theia {
    const commandRegistryExt = rpc.set(MAIN_RPC_CONTEXT.COMMAND_REGISTRY_EXT, new CommandRegistryImpl(rpc));
    const quickOpenExt = rpc.set(MAIN_RPC_CONTEXT.QUICK_OPEN_EXT, new QuickOpenExtImpl(rpc));
    const messageRegistryExt = new MessageRegistryExt(rpc);
    const editorsAndDocuments = rpc.set(MAIN_RPC_CONTEXT.EDITORS_AND_DOCUMENTS_EXT, new EditorsAndDocumentsExtImpl(rpc));
    const editors = rpc.set(MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT, new TextEditorsExtImpl(rpc, editorsAndDocuments));
    const documents = rpc.set(MAIN_RPC_CONTEXT.DOCUMENTS_EXT, new DocumentsExtImpl(rpc, editorsAndDocuments));

    const commands: typeof theia.commands = {
        registerCommand(command: theia.Command, handler?: <T>(...args: any[]) => T | Thenable<T>): Disposable {
            return commandRegistryExt.registerCommand(command, handler);
        },
        executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined> {
            return commandRegistryExt.executeCommand<T>(commandId, args);
        },
        registerTextEditorCommand(command: theia.Command, callback: (textEditor: theia.TextEditor, edit: theia.TextEditorEdit, ...arg: any[]) => void): Disposable {
            throw new Error("Function registerTextEditorCommand is not implemented");
        },
        registerHandler(commandId: string, handler: (...args: any[]) => any): Disposable {
            return commandRegistryExt.registerHandler(commandId, handler);
        }
    };

    const window: typeof theia.window = {
        get activeTextEditor() {
            return editors.getActiveEditor();
        },
        get visibleTextEditors() {
            return editors.getVisibleTextEditors();
        },
        onDidChangeActiveTextEditor(listener, thisArg?, disposables?) {
            return editors.onDidChangeActiveTextEditor(listener, thisArg, disposables);
        },
        onDidChangeVisibleTextEditors(listener, thisArg?, disposables?) {
            return editors.onDidChangeVisibleTextEditors(listener, thisArg, disposables);
        },
        onDidChangeTextEditorSelection(listener, thisArg?, disposables?) {
            return editors.onDidChangeTextEditorSelection(listener, thisArg, disposables);
        },
        onDidChangeTextEditorOptions(listener, thisArg?, disposables?) {
            return editors.onDidChangeTextEditorOptions(listener, thisArg, disposables);
        },
        onDidChangeTextEditorViewColumn(listener, thisArg?, disposables?) {
            return editors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
        },
        onDidChangeTextEditorVisibleRanges(listener, thisArg?, disposables?) {
            return editors.onDidChangeTextEditorVisibleRanges(listener, thisArg, disposables);
        },
        showQuickPick(items: any, options: theia.QuickPickOptions, token?: theia.CancellationToken): any {
            return quickOpenExt.showQuickPick(items, options, token);
        },
        showInformationMessage(message: string,
            optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
            ...items: any[]): PromiseLike<any> {
            return messageRegistryExt.showInformationMessage(message, optionsOrFirstItem, items);
        },
        showWarningMessage(message: string,
            optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
            ...items: any[]): PromiseLike<any> {
            return messageRegistryExt.showWarningMessage(message, optionsOrFirstItem, items);
        },
        showErrorMessage(message: string,
            optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
            ...items: any[]): PromiseLike<any> {
            return messageRegistryExt.showErrorMessage(message, optionsOrFirstItem, items);
        }
    };

    const workspace: typeof theia.workspace = {
        get textDocuments() {
            return documents.getAllDocumentData().map(data => data.document);
        },
        onDidChangeTextDocument(listener, thisArg?, disposables?) {
            return documents.onDidChangeDocument(listener, thisArg, disposables);
        },
        onDidCloseTextDocument(listener, thisArg?, disposables?) {
            return documents.onDidRemoveDocument(listener, thisArg, disposables);
        },
        onDidOpenTextDocument(listener, thisArg?, disposables?) {
            return documents.onDidAddDocument(listener, thisArg, disposables);
        },
    };

    return <typeof theia>{
        commands,
        window,
        workspace,
        // Types
        Disposable: Disposable,
        EventEmitter: Emitter,
        CancellationTokenSource: CancellationTokenSource,
        Position: Position,
        Range: Range,
        Selection: Selection,
        ViewColumn: ViewColumn,
        TextEditorSelectionChangeKind: TextEditorSelectionChangeKind,
    };

}

export function startPlugin(plugin: Plugin, pluginMain: any, plugins: Map<string, () => void>): void {
    if (typeof pluginMain[plugin.lifecycle.startMethod] === 'function') {
        pluginMain[plugin.lifecycle.startMethod].apply(global, []);
    } else {
        console.log('there is no doStart method on plugin');
    }

    if (typeof pluginMain[plugin.lifecycle.stopMethod] === 'function') {
        const pluginId = getPluginId(plugin.model);
        plugins.set(pluginId, pluginMain[plugin.lifecycle.stopMethod]);
    }
}
