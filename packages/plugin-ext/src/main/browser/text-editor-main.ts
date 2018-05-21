/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";
import { TextEditorConfiguration, EditorChangedPropertiesData } from "../../api/plugin-api";
import { DisposableCollection, Emitter, Event } from "@theia/core";
import { TextEditorCursorStyle } from "../../common/editor-options";
import { TextEditorLineNumbersStyle } from "../../plugin/types-impl";

export class TextEditorMain {

    private properties: TextEditorPropertiesMain | undefined;
    private modelListeners: DisposableCollection = new DisposableCollection();
    private editor: MonacoEditor | undefined;
    private editorListeners = new DisposableCollection();

    private readonly onPropertiesChangedEmitter = new Emitter<EditorChangedPropertiesData>();

    constructor(
        private id: string,
        private model: monaco.editor.IModel,
        editor: MonacoEditor
    ) {
        this.properties = undefined;
        this.modelListeners.push(this.model.onDidChangeOptions(e => {
            this.updateProperties(undefined);
        }));
        this.setEditor(editor);
        this.updateProperties(undefined);
    }

    private updateProperties(source?: string): void {
        this.setProperties(TextEditorPropertiesMain.readFromEditor(this.properties, this.model, this.editor!), source);
    }

    private setProperties(newProperties: TextEditorPropertiesMain, source: string | undefined): void {
        const result = newProperties.generateDelta(this.properties, source);
        this.properties = newProperties;
        if (result) {
            this.onPropertiesChangedEmitter.fire(result);
        }
    }

    private setEditor(editor?: MonacoEditor): void {
        if (this.editor === editor) {
            return;
        }

        this.editorListeners.dispose();
        this.editorListeners = new DisposableCollection();
        this.editor = editor;

        if (this.editor) {
            const monaco = this.editor.getControl();
            this.editorListeners.push(this.editor.onSelectionChanged(_ => {
                this.updateProperties();
            }));
            this.editorListeners.push(monaco.onDidChangeModel(() => {
                this.setEditor(undefined);
            }));
            this.editorListeners.push(monaco.onDidChangeCursorSelection(e => {
                this.updateProperties(e.source);
            }));
            this.editorListeners.push(monaco.onDidChangeConfiguration(() => {
                this.updateProperties();
            }));
            this.editorListeners.push(monaco.onDidLayoutChange(() => {
                this.updateProperties();
            }));
            this.editorListeners.push(monaco.onDidScrollChange(() => {
                this.updateProperties();
            }));

            this.updateProperties();

        }
    }

    dispose(): void {
        delete this.model;
        this.modelListeners.dispose();
        delete this.editor;
    }

    getId(): string {
        return this.id;
    }

    getModel(): monaco.editor.IModel {
        return this.model;
    }

    getProperties(): TextEditorPropertiesMain | undefined {
        return this.properties;
    }

    get onPropertiesChangedEvent(): Event<EditorChangedPropertiesData> {
        return this.onPropertiesChangedEmitter.event;
    }
}

export class TextEditorPropertiesMain {
    constructor(
        readonly selections: monaco.Selection[],
        readonly options: TextEditorConfiguration,
        readonly visibleRanges: monaco.Range[]
    ) {
    }

    generateDelta(old: TextEditorPropertiesMain | undefined, source: string | undefined): EditorChangedPropertiesData | undefined {
        const result: EditorChangedPropertiesData = {
            options: undefined,
            selections: undefined,
            visibleRanges: undefined
        };

        if (!old || !TextEditorPropertiesMain.selectionsEqual(old.selections, this.selections)) {
            result.selections = {
                selections: this.selections,
                source: source
            };
        }

        if (!old || !TextEditorPropertiesMain.optionsEqual(old.options, this.options)) {
            result.options = this.options;
        }

        if (!old || !TextEditorPropertiesMain.rangesEqual(old.visibleRanges, this.visibleRanges)) {
            result.visibleRanges = this.visibleRanges;
        }

        if (result.selections || result.visibleRanges || result.options) {
            return result;
        }

        return undefined;
    }

    static readFromEditor(prevProperties: TextEditorPropertiesMain | undefined, model: monaco.editor.IModel, editor: MonacoEditor): TextEditorPropertiesMain {
        const selections = TextEditorPropertiesMain.getSelectionsFromEditor(prevProperties, editor);
        const options = TextEditorPropertiesMain.getOptionsFromEditor(prevProperties, model, editor);
        const visibleRanges = TextEditorPropertiesMain.getVisibleRangesFromEditor(prevProperties, editor);
        return new TextEditorPropertiesMain(selections, options, visibleRanges);
    }

    private static getSelectionsFromEditor(prevProperties: TextEditorPropertiesMain | undefined, editor: MonacoEditor): monaco.Selection[] {
        let result: monaco.Selection[] | undefined = undefined;
        if (editor) {
            result = editor.getControl().getSelections();
        }

        if (!result && prevProperties) {
            result = prevProperties.selections;
        }

        if (!result) {
            result = [new monaco.Selection(1, 1, 1, 1)];
        }
        return result;
    }

    private static getOptionsFromEditor(prevProperties: TextEditorPropertiesMain | undefined, model: monaco.editor.IModel, editor: MonacoEditor): TextEditorConfiguration {
        if (model.isDisposed()) {
            return prevProperties!.options;
        }

        let cursorStyle: TextEditorCursorStyle;
        let lineNumbers: TextEditorLineNumbersStyle;
        if (editor) {
            const editorOptions = editor.getControl().getConfiguration();
            cursorStyle = editorOptions.viewInfo.cursorStyle;
            switch (editorOptions.viewInfo.renderLineNumbers) {
                case monaco.editor.RenderLineNumbersType.Off:
                    lineNumbers = TextEditorLineNumbersStyle.Off;
                    break;
                case monaco.editor.RenderLineNumbersType.Relative:
                    lineNumbers = TextEditorLineNumbersStyle.Relative;
                    break;
                default:
                    lineNumbers = TextEditorLineNumbersStyle.On;
                    break;
            }
        } else if (prevProperties) {
            cursorStyle = prevProperties.options.cursorStyle;
            lineNumbers = prevProperties.options.lineNumbers;
        } else {
            cursorStyle = TextEditorCursorStyle.Line;
            lineNumbers = TextEditorLineNumbersStyle.On;
        }

        const modelOptions = model.getOptions();
        return {
            insertSpaces: modelOptions.insertSpaces,
            tabSize: modelOptions.tabSize,
            cursorStyle,
            lineNumbers,
        };
    }

    private static getVisibleRangesFromEditor(prevProperties: TextEditorPropertiesMain | undefined, editor: MonacoEditor): monaco.Range[] {
        if (editor) {
            return editor.getControl().getVisibleRanges();
        }
        return [];
    }

    private static selectionsEqual(a: monaco.Selection[], b: monaco.Selection[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsSelection(b[i])) {
                return false;
            }
        }
        return true;
    }

    private static optionsEqual(a: TextEditorConfiguration, b: TextEditorConfiguration): boolean {
        if (a && !b || !a && b) {
            return false;
        }
        if (!a && !b) {
            return true;
        }
        return (
            a.tabSize === b.tabSize
            && a.insertSpaces === b.insertSpaces
            && a.cursorStyle === b.cursorStyle
            && a.lineNumbers === b.lineNumbers
        );
    }

    private static rangesEqual(a: monaco.Range[], b: monaco.Range[]): boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!a[i].equalsRange(b[i])) {
                return false;
            }
        }
        return true;
    }

}
