/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { createProxyIdentifier, ProxyIdentifier } from './rpc-protocol';
import * as theia from '@theia/plugin';
import { PluginLifecycle, PluginModel, PluginMetadata } from '../common/plugin-protocol';
import { TextEditorCursorStyle } from '../common/editor-options';
import { TextEditorLineNumbersStyle, UriComponents } from '../plugin/types-impl';

export interface HostedPluginManagerExt {
    $initialize(contextPath: string, pluginMedata: PluginMetadata): void;
    $loadPlugin(contextPath: string, plugin: Plugin): void;
    $stopPlugin(contextPath: string): PromiseLike<void>;
}

export interface Plugin {
    pluginPath: string;
    model: PluginModel;
    lifecycle: PluginLifecycle;
}

export interface CommandRegistryMain {
    $registerCommand(command: theia.Command): void;

    $unregisterCommand(id: string): void;
    $executeCommand<T>(id: string, args: any[]): PromiseLike<T | undefined>;
    $getCommands(): PromiseLike<string[]>;
}

export interface CommandRegistryExt {
    $executeCommand<T>(id: string, ...ars: any[]): PromiseLike<T>;
}

export interface AutoFocus {
    autoFocusFirstEntry?: boolean;
    // TODO:
}

export interface PickOptions {
    placeHolder?: string;
    autoFocus?: AutoFocus;
    matchOnDescription?: boolean;
    matchOnDetail?: boolean;
    ignoreFocusLost?: boolean;
    quickNavigationConfiguration?: {}; // TODO:
    contextKey?: string;
    canSelectMany?: boolean;
}

export interface PickOpenItem {
    handle: number;
    id?: string;
    label: string;
    description?: string;
    detail?: string;
    picked?: boolean;
}

export interface MessageRegistryMain {
    $showInformationMessage(message: string,
        optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
        items: string[] | theia.MessageItem[]): PromiseLike<string | theia.MessageItem | undefined>;
    $showWarningMessage(message: string,
        optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
        items: string[] | theia.MessageItem[]): PromiseLike<string | theia.MessageItem | undefined>;
    $showErrorMessage(message: string,
        optionsOrFirstItem: theia.MessageOptions | string | theia.MessageItem,
        items: string[] | theia.MessageItem[]): PromiseLike<string | theia.MessageItem | undefined>;
}
export interface QuickOpenExt {
    $onItemSelected(handle: number): void;
    $validateInput(input: string): PromiseLike<string> | undefined;
}

export interface QuickOpenMain {
    $show(options: PickOptions): PromiseLike<number | number[]>;
    $setItems(items: PickOpenItem[]): PromiseLike<any>;
    $setError(error: Error): PromiseLike<any>;
    $input(options: theia.InputBoxOptions, validateInput: boolean): PromiseLike<string>;
}

export enum EditorPosition {
    ONE = 0,
    TWO = 1,
    THREE = 2
}

export interface Range {
    /**
     * Line number on which the range starts (starts at 1).
     */
    readonly startLineNumber: number;
    /**
     * Column on which the range starts in line `startLineNumber` (starts at 1).
     */
    readonly startColumn: number;
    /**
     * Line number on which the range ends.
     */
    readonly endLineNumber: number;
    /**
     * Column on which the range ends in line `endLineNumber`.
     */
    readonly endColumn: number;
}

export interface Selection {
    /**
     * The line number on which the selection has started.
     */
    readonly selectionStartLineNumber: number;
    /**
     * The column on `selectionStartLineNumber` where the selection has started.
     */
    readonly selectionStartColumn: number;
    /**
     * The line number on which the selection has ended.
     */
    readonly positionLineNumber: number;
    /**
     * The column on `positionLineNumber` where the selection has ended.
     */
    readonly positionColumn: number;
}

export interface TextEditorConfiguration {
    tabSize?: number;
    insertSpaces: boolean;
    cursorStyle: TextEditorCursorStyle;
    lineNumbers: TextEditorLineNumbersStyle;
}

export interface SelectionChangeEvent {
    selections: Selection[];
    source?: string;
}

export interface EditorChangedPropertiesData {
    options?: TextEditorConfiguration;
    selections?: SelectionChangeEvent;
    visibleRanges?: Range[];
}

export interface TextEditorPositionData {
    [id: string]: EditorPosition;
}

export interface TextEditorsExt {
    $acceptEditorPropertiesChanged(id: string, props: EditorChangedPropertiesData): void;
    $acceptEditorPositionData(data: TextEditorPositionData): void;
}

export interface TextEditorsMain {
    // TODO: add all methods
}

export interface ModelAddedData {
    uri: UriComponents;
    versionId: number;
    lines: string[];
    EOL: string;
    modeId: string;
    isDirty: boolean;
}

export interface TextEditorAddData {
    id: string;
    documentUri: UriComponents;
    options: TextEditorConfiguration;
    selections: Selection[];
    visibleRanges: Range[];
    editorPosition?: EditorPosition;
}

export interface EditorsAndDocumentsDelta {
    removedDocuments?: UriComponents[];
    addedDocuments?: ModelAddedData[];
    removedEditors?: string[];
    addedEditors?: TextEditorAddData[];
    newActiveEditor?: string;
}

export interface EditorsAndDocumentsExt {
    $acceptEditorsAndDocumentsDelta(delta: EditorsAndDocumentsDelta): void;
}

export interface ModelContentChange {
    readonly range: Range;
    readonly rangeLength: number;
    readonly text: string;
}
export interface ModelChangedEvent {
    readonly changes: ModelContentChange[];

    readonly eol: string;

    readonly versionId: number;
}

export interface DocumentsExt {
    $acceptModelModeChanged(startUrl: UriComponents, oldModeId: string, newModeId: string): void;
    $acceptModelSaved(strUrl: UriComponents): void;
    $acceptDirtyStateChanged(strUrl: UriComponents, isDirty: boolean): void;
    $acceptModelChanged(strUrl: UriComponents, e: ModelChangedEvent, isDirty: boolean): void;
}

export interface DocumentsMain {
    $tryCreateDocument(options?: { language?: string; content?: string; }): PromiseLike<UriComponents>;
    $tryOpenDocument(uri: UriComponents): PromiseLike<void>;
    $trySaveDocument(uri: UriComponents): PromiseLike<boolean>;
}

export const PLUGIN_RPC_CONTEXT = {
    COMMAND_REGISTRY_MAIN: <ProxyIdentifier<CommandRegistryMain>>createProxyIdentifier<CommandRegistryMain>('CommandRegistryMain'),
    QUICK_OPEN_MAIN: createProxyIdentifier<QuickOpenMain>('QuickOpenMain'),
    MESSAGE_REGISTRY_MAIN: <ProxyIdentifier<MessageRegistryMain>>createProxyIdentifier<MessageRegistryMain>('MessageRegistryMain'),
    TEXT_EDITORS_MAIN: createProxyIdentifier<TextEditorsMain>('TextEditorsMain'),
    DOCUMENTS_MAIN: createProxyIdentifier<DocumentsMain>('DocumentsMain'),
};

export const MAIN_RPC_CONTEXT = {
    HOSTED_PLUGIN_MANAGER_EXT: createProxyIdentifier<HostedPluginManagerExt>('HostedPluginManagerExt'),
    COMMAND_REGISTRY_EXT: createProxyIdentifier<CommandRegistryExt>('CommandRegistryExt'),
    QUICK_OPEN_EXT: createProxyIdentifier<QuickOpenExt>('QuickOpenExt'),
    TEXT_EDITORS_EXT: createProxyIdentifier<TextEditorsExt>('TextEditorsExt'),
    EDITORS_AND_DOCUMENTS_EXT: createProxyIdentifier<EditorsAndDocumentsExt>('EditorsAndDocumentsExt'),
    DOCUMENTS_EXT: createProxyIdentifier<DocumentsExt>('DocumentsExt'),
};
