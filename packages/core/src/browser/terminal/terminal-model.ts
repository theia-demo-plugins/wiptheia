/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Disposable } from "../../common";

/**
 * Terminal model describes interfaces for creation and using terminal widget.
 */

/**
 * Terminal options.
 */
export const TerminalWidgetOptions = Symbol("TerminalWidgetOptions");
export interface TerminalWidgetOptions {

    /**
     * Human readalbe terminal representation on Ui.
     */
    readonly title?: string ;

    /**
     * Path to the executable shell.
     */
    readonly shellPath?: string;

    /**
     * Shell arugments to exectualbe shell, for example: ["-l"] - without login.
     */
    readonly shellArgs?: string[];

    /**
     * Current working directory.
     */
    readonly cwd?: string;

    /**
     * Enviroment variables for terminal.
     */
    readonly env?: { [key: string]: string | null };

    /**
     * In case "destroyTermOnCloseKill" is true - terminal process will be destroyed on close terminal widget, otherwise will be keeped
     * alive.
     */
    destroyTermOnClose?: boolean;

    /**
     * Terminal server side can send to the client "terminal title" to dispaly this value on the UI. If
     * overrideTitle = true, we skip this title and use our own custom title defined by "title" argument.
     * If overrideTitle = false, we are using terminal title from server side.
     */
    overrideTitle?: boolean;

    /** Terminal id. Should be unique for all DOM. */
    id?: string;
}

/**
 * Describes terminal UI widget.
 */
export const TerminalWidget = Symbol("TerminalWidget");
export interface TerminalWidget {
    /**
     * Start terminal and return terminal id.
     */
    start(): Promise<number>;
    /**
     * Send text to the terminal server.
     * @param text - content for server.
     * @param addNewLine - apply new line after text
     */
    sendText(text: string, addNewLine?: boolean): void;
    /**
     * Destroy terminal widget.
     */
    dispose(): void;
    /**
     * Apply disposable object where is described actions to do when terminal is closed.
     * @param dispose disposeble actions;
     */
    onDidClosed(dispose: Disposable): void;
}