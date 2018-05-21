/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

declare module '@theia/plugin' {

    export class Disposable {

        constructor(func: () => void);
        /**
         * Dispose this object.
         */
        dispose(): void;

        static create(func: () => void): Disposable;

    }

    /**
     * A command is a unique identifier of a function
     * which can be executed by a user via a keyboard shortcut,
     * a menu action or directly.
     */
    export interface Command {
        /**
         * A unique identifier of this command.
         */
        id: string;
        /**
         * A label of this command.
         */
        label?: string;
        /**
         * An icon class of this command.
         */
        iconClass?: string;
    }

    /**
     * Represents a line and character position.
     */
    export class Position {
        // TODO: add content
        constructor(line: number, char: number);
    }

    /**
     * Pair if two positions.
     */
    export class Range {
        // /**
        //  * Start position.
        //  */
        // readonly start: Position;

        // /**
        //  * End position.
        //  */
        // readonly end: Position;

        // /**
        //  * `true` if start and end are equal
        //  */
        // isEmpty: boolean;

        // /**
        //  * `true` if `start.line` and `end.line` are equal
        //  */
        // isSingleLine: boolean;

        /**
         * Create a new range from two positions.
         * If `start` is not before or equal to `end`, the values will be swapped.
         * 
         * @param start a position
         * @param end a position
         */
        constructor(start: Position, end: Position);

        /**
         * Create a new position from coordinates.
         * 
         * @param startLine a zero based line value
         * @param startChar a zero based character value
         * @param endLine a zero based line value
         * @param endChar a zero based character value
         */
        constructor(startLine: number, startChar: number, endLine: number, endChar: number);

        // /**
        //  * Check if a position or a range is in this range.
        //  * 
        //  * @param positionOrRange a position or a range
        //  */
        // contains(positionOrRange: Position | Range): boolean;

        // /**
        //  * Check `other` equals this range.
        //  * 
        //  * @param other a range
        //  */
        // isEqual(other: Range): boolean;

        // /**
        //  * Intersect `range` with this range and returns new range or `undefined`
        //  * 
        //  * @param range a range
        //  */
        // intersection(range: Range): Range | undefined;

        // /**
        //  * Compute the union of `other` with this range.
        //  * 
        //  * @param other a range
        //  */
        // union(other: Range): Range;

        // /**
        //  * Derived a new range from this range.
        //  * 
        //  * @param start 
        //  * @param end 
        //  */
        // with(start?: Position, end?: Position): Range;

        // /**
        //  * Derived a new range from this range.
        //  */
        // with(change: { start?: Position, end?: Position }): Range;
    }

    /**
     * Represents a text selection in an editor.
     */
    export class Selection extends Range {

        // /**
        //  * Position where selection starts.
        //  */
        // anchor: Position;

        // /**
        //  * Position of the cursor
        //  */
        // active: Position;

        // /**
        //  * A selection is reversed if `active.isBefore(anchor)`
        //  */
        // isReversed: boolean;

        // /**
        //  * Create a selection from two positions.
        //  * 
        //  * @param anchor a position 
        //  * @param active a position
        //  */
        // constructor(anchor: Position, active: Position);

        // /**
        //  * Create a selection from coordinates.
        //  * 
        //  * @param anchorLine a zero based line value
        //  * @param anchorChar a zero based character value
        //  * @param activeLine a zero based line value
        //  * @param activeChar a zero based character value
        //  */
        // constructor(anchorLine: number, anchorChar: number, activeLine: number, activeChar: number);
    }

    /**
     * Represents a text editor.
     */
    export interface TextEditor {
        // TODO: implement TextEditor
    }

    /**
     *
     */
    export interface TextEditorEdit {
        // TODO: implement TextEditorEdit
    }

    export interface TextDocument {
        // TODO: implement TextDocument
    }

    export interface TextDocumentChangeEvent {
        document: TextDocument;

        contentChanges: TextDocumentContentChangeEvent[];
    }

    export interface TextDocumentContentChangeEvent {
        range: Range;
        rangeLength: number;
        text: string;
    }

    /**
     * Represents a text editor's options
     */
    export interface TextEditorOptions {
        // TODO: implement this
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
     * Represents a typed event.
     */
    export interface Event<T> {

        /**
         *
         * @param listener The listener function will be call when the event happens.
         * @param thisArgs The 'this' which will be used when calling the event listener.
         * @param disposables An array to which a {{IDisposable}} will be added.
         * @return a disposable to remove the listener again.
         */
        (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
    }

    /**
     * An event emitter used to create and fire an [event](#Event) or to subscribe to.
     */
    export class EventEmitter<T> {
        /**
         * The event listeners can subscribe to
         */
        event: Event<T>;

        /**
         * Fire the event and pass data object
         * @param data
         */
        fire(data?: T): void;

        /**
         * Dispose this object
         */
        dispose(): void;
    }

    /**
     * A cancellation token used to request cancellation on long running
     * or asynchronous task.
     */
    export interface CancellationToken {
        readonly isCancellationRequested: boolean;
        /*
         * An event emitted when cancellation is requested
         * @event
         */
        readonly onCancellationRequested: Event<void>;
    }

    /**
     * A cancellation token source create and manage a [cancellation token](#CancellationToken)
     */
    export class CancellationTokenSource {
        token: CancellationToken;
        cancel(): void;
        dispose(): void;
    }

    /**
     * Something that can be selected from a list of items.
     */
    export interface QuickPickItem {

        /**
         * The item label
         */
        label: string;

        /**
         * The item description
         */
        description?: string;

        /**
         * The item detail
         */
        detail?: string;

        /**
         * Used for [QuickPickOptions.canPickMany](#QuickPickOptions.canPickMany)
         * not implemented yet
         */
        picked?: boolean;
    }

    /**
     * Options for configuration behavior of the quick pick
     */
    export interface QuickPickOptions {
        /**
         * A flag to include the description when filtering
         */
        machOnDescription?: boolean;

        /**
         *  A flag to include the detail when filtering
         */
        machOnDetail?: boolean;

        /**
         * The place holder in input box
         */
        placeHolder?: string;

        /**
         * If `true` prevent picker closing when it's loses focus
         */
        ignoreFocusOut?: boolean;

        /**
         * If `true` make picker accept multiple selections.
         * Not implemented yet
         */
        canPickMany?: boolean;

        /**
         * Function that is invoked when item selected
         */
        onDidSelectItem?(item: QuickPickItem | string): any;
    }

    export interface InputBoxOptions {
        value?: string;

        valueSelection?: [number, number];
        prompt?: string;
        placeHolder?: string;
        password?: boolean;
        ignoreFocusOut?: boolean;
        validateInput?(value: string): string | undefined | null | PromiseLike<string | undefined | null>;
    }

    /**
     * Represents sources that can cause `window.onDidChangeEditorSelection`
     */
    export enum TextEditorSelectionChangeKind {
        Keyboard = 1,

        Mouse = 2,

        Command = 3
    }

    /**
     * Represents an event describing the change in text editor selections.
     */
    export interface TextEditorSelectionChangeEvent {
        /**
         * The text editor for which the selections have changed.
         */
        textEditor: TextEditor;
        /**
         * The new text editor selections
         */
        selections: Selection[];

        kind?: TextEditorSelectionChangeKind;
    }

    /**
     * Represents an event the change in a text editor's visible ranges
     */
    export interface TextEditorVisibleRangesChangeEvent {
        /**
         * The text editor for which the visible ranges have changes.
         */
        textEditor: TextEditor;
        /**
         * The new text editor visible ranges.
         */
        visibleRanges: Range[];
    }

    /**
     * Represents an event the change in a text editor's options
     */
    export interface TextEditorOptionsChangeEvent {
        textEditor: TextEditor;

        options: TextEditorOptions;
    }

    /**
     * Represents an event describing the change of a text editor's view column.
     */
    export interface TextEditorViewColumnChangeEvent {
        /**
         * The text editor for which the options have changed.
         */
        textEditor: TextEditor;
        /**
         * The new value for the text editor's view column.
         */
        viewColumn: ViewColumn;
    }

    /**
	 * Namespace for dealing with commands. In short, a command is a function with a
	 * unique identifier. The function is sometimes also called _command handler_.
     * 
     * Commands can be added using the [registerCommand](#commands.registerCommand) and
     * [registerTextEditorCommand](#commands.registerTextEditorCommand) functions.
     * Registration can be split in two step: first register command without handler,
     * second register handler by command id.
     *
     * Any contributed command are available to any plugin, command can be invoked
     * by [executeCommand](#commands.executeCommand) function.
     *
     * Simple example that register command:
     * ```javascript
     * theia.commands.registerCommand({id:'say.hello.command'}, ()=>{
     *     console.log("Hello World!");
     * });
     * ```
     *
     * Simple example that invoke command:
     *
     * ```javascript
     * theia.commands.executeCommand('core.about');
     * ```
     */
    export namespace commands {
        /**
         * Register the given command and handler if present.
         *
         * Throw if a command is already registered for the given command identifier.
         */
        export function registerCommand(command: Command, handler?: (...args: any[]) => any): Disposable;

        /**
         * Register the given handler for the given command identifier.
         *
         * @param commandId a given command id
         * @param handler a command handler
         */
        export function registerHandler(commandId: string, handler: (...args: any[]) => any): Disposable;

        /**
         * Register a text editor command which can execute only if active editor present and command has access to the active editor
         *
         * @param command a command description
         * @param handler a command handler with access to text editor
         */
        export function registerTextEditorCommand(command: Command, handler: (textEditor: TextEditor, edit: TextEditorEdit, ...arg: any[]) => void): Disposable;

        /**
         * Execute the active handler for the given command and arguments.
         *
         * Reject if a command cannot be executed.
         */
        export function executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined>;
    }

    /**
     * Represents an action that is shown with a message.
     */
    export interface MessageItem {

        /**
         * A message title.
         */
        title: string;

        /**
         * Indicates that the item should be triggered
         * when the user cancels the dialog.
         *
         * Note: this option is ignored for non-modal messages.
         */
        isCloseAffordance?: boolean;
    }

    /**
     * Options to configure the message behavior.
     */
    export interface MessageOptions {

        /**
         * Indicates that this message should be modal.
         */
        modal?: boolean;
    }

    /**
     * Common namespace for dealing with window and editor, showing messages and user input.
     */
    export namespace window {

        export let activeTextEditor: TextEditor | undefined;

        export let visibleTextEditors: TextEditor[];

        export const onDidChangeActiveTextEditor: Event<TextEditor | undefined>;

        export const onDidChangeVisibleTextEditors: Event<TextEditor[]>;

        export const onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent>;

        export const onDidChangeTextEditorVisibleRanges: Event<TextEditorVisibleRangesChangeEvent>;

        export const onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent>;

        export const onDidChangeTextEditorViewColumn: Event<TextEditorViewColumnChangeEvent>;


        /**
         * Shows a selection list.
         * @param items
         * @param options
         * @param token
         */
        export function showQuickPick(items: string[] | PromiseLike<string[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<string[] | undefined>;

        /**
         * Shows a selection list with multiple selection allowed.
         */
        export function showQuickPick(items: string[] | PromiseLike<string[]>, options: QuickPickOptions & { canPickMany: true }, token?: CancellationToken): PromiseLike<string[] | undefined>;

        /**
         * Shows a selection list.
         * @param items
         * @param options
         * @param token
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | PromiseLike<T[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<T[] | undefined>;

        /**
         * Shows a selection list with multiple selection allowed.
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | PromiseLike<T[]>, options: QuickPickOptions & { canPickMany: true }, token?: CancellationToken): PromiseLike<T[] | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage(message: string, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage<T extends MessageItem>(message: string, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage<T extends MessageItem>(message: string, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;
    }

    /**
     * Namespace for dealing with the current workspace.
     */
    export namespace workspace {
        export let textDocuments: TextDocument[];

        export const onDidOpenTextDocument: Event<TextDocument>;

        export const onDidCloseTextDocument: Event<TextDocument>;

        export const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;

    }
}
