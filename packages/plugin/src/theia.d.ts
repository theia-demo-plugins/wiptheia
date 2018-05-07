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
     * Represents a text editor.
     */
    export interface TextEditor {
        // TODO implement TextEditor
    }

    /**
     * 
     */
    export interface TextEditorEdit {
        // TODO implement TextEditorEdit
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


    // todo docs
    export interface Terminal {
        // readonly name: string;

        // readonly processId: Thenable<number>;

        sendText(text: string, addNewLine?: boolean): void;

        show(preserveFocus?: boolean): void;

        hide(): void;

        dispose(): void;
    }

    export interface TerminalOptions {

		name?: string;

		shellPath?: string;

        shellArgs?: string[];

		cwd?: string;

		env?: { [key: string]: string | null };
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
        export function registerCommand(command: Command, handler?: (...args: any[]) => any): Disposable

        /**
         * Register the given handler for the given command identifier.
         * 
         * @param commandId a given command id
         * @param handler a command handler
         */
        export function registerHandler(commandId: string, handler: (...args: any[]) => any): Disposable

        /**
         * Register a text editor command which can execute only if active editor present and command has access to the active editor 
         * 
         * @param command a command description 
         * @param handler a command handler with access to text editor 
         */
        export function registerTextEditorCommand(command: Command, handler: (textEditor: TextEditor, edit: TextEditorEdit, ...arg: any[]) => void): Disposable

        /**
         * Execute the active handler for the given command and arguments.
         *
         * Reject if a command cannot be executed.
         */
        export function executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined>
    }

    /**
     * Common namespace for dealing with window and editor, showing messages and user input.
     */
    export namespace window {

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

        export function createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal;
        // export const onDidCloseTerminal: Event<Terminal>;
        export function createTerminal(options: TerminalOptions): Terminal;
    }
}
