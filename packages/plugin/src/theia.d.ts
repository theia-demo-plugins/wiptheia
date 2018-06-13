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

        /**
         * The zero-based line value.
        */
        readonly line: number;

		/**
		 * The zero-based character value.
		 */
        readonly character: number;

        constructor(line: number, char: number);

        /**
		 * Check if this position is before `other`.
		 *
		 * @param other A position.
		 * @return `true` if position is on a smaller line
		 * or on the same line on a smaller character.
		 */
        isBefore(other: Position): boolean;

		/**
		 * Check if this position is before or equal to `other`.
		 *
		 * @param other A position.
		 * @return `true` if position is on a smaller line
		 * or on the same line on a smaller or equal character.
		 */
        isBeforeOrEqual(other: Position): boolean;

		/**
		 * Check if this position is after `other`.
		 *
		 * @param other A position.
		 * @return `true` if position is on a greater line
		 * or on the same line on a greater character.
		 */
        isAfter(other: Position): boolean;

		/**
		 * Check if this position is after or equal to `other`.
		 *
		 * @param other A position.
		 * @return `true` if position is on a greater line
		 * or on the same line on a greater or equal character.
		 */
        isAfterOrEqual(other: Position): boolean;

		/**
		 * Check if this position is equal to `other`.
		 *
		 * @param other A position.
		 * @return `true` if the line and character of the given position are equal to
		 * the line and character of this position.
		 */
        isEqual(other: Position): boolean;

		/**
		 * Compare this to `other`.
		 *
		 * @param other A position.
		 * @return A number smaller than zero if this position is before the given position,
		 * a number greater than zero if this position is after the given position, or zero when
		 * this and the given position are equal.
		 */
        compareTo(other: Position): number;

		/**
		 * Create a new position relative to this position.
		 *
		 * @param lineDelta Delta value for the line value, default is `0`.
		 * @param characterDelta Delta value for the character value, default is `0`.
		 * @return A position which line and character is the sum of the current line and
		 * character and the corresponding deltas.
		 */
        translate(lineDelta?: number, characterDelta?: number): Position;

		/**
		 * Derived a new position relative to this position.
		 *
		 * @param change An object that describes a delta to this position.
		 * @return A position that reflects the given delta. Will return `this` position if the change
		 * is not changing anything.
		 */
        translate(change: { lineDelta?: number; characterDelta?: number; }): Position;

		/**
		 * Create a new position derived from this position.
		 *
		 * @param line Value that should be used as line value, default is the [existing value](#Position.line)
		 * @param character Value that should be used as character value, default is the [existing value](#Position.character)
		 * @return A position where line and character are replaced by the given values.
		 */
        with(line?: number, character?: number): Position;

		/**
		 * Derived a new position from this position.
		 *
		 * @param change An object that describes a change to this position.
		 * @return A position that reflects the given change. Will return `this` position if the change
		 * is not changing anything.
		 */
        with(change: { line?: number; character?: number; }): Position;
    }

    /**
     * Pair if two positions.
     */
    export class Range {
        /**
         * Start position.
         */
        readonly start: Position;

        /**
         * End position.
         */
        readonly end: Position;

        /**
         * `true` if start and end are equal
         */
        isEmpty: boolean;

        /**
         * `true` if `start.line` and `end.line` are equal
         */
        isSingleLine: boolean;

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

        /**
         * Check if a position or a range is in this range.
         *
         * @param positionOrRange a position or a range
         */
        contains(positionOrRange: Position | Range): boolean;

        /**
         * Check `other` equals this range.
         *
         * @param other a range
         */
        isEqual(other: Range): boolean;

        /**
         * Intersect `range` with this range and returns new range or `undefined`
         *
         * @param range a range
         */
        intersection(range: Range): Range | undefined;

        /**
         * Compute the union of `other` with this range.
         *
         * @param other a range
         */
        union(other: Range): Range;

        /**
         * Derived a new range from this range.
         *
         * @param start
         * @param end
         */
        with(start?: Position, end?: Position): Range;

        /**
         * Derived a new range from this range.
         */
        with(change: { start?: Position, end?: Position }): Range;
    }

    /**
     * Represents a text selection in an editor.
     */
    export class Selection extends Range {

        /**
         * Position where selection starts.
         */
        anchor: Position;

        /**
         * Position of the cursor
         */
        active: Position;

        /**
         * A selection is reversed if `active.isBefore(anchor)`
         */
        isReversed: boolean;

        /**
         * Create a selection from two positions.
         *
         * @param anchor a position
         * @param active a position
         */
        constructor(anchor: Position, active: Position);

        /**
         * Create a selection from coordinates.
         *
         * @param anchorLine a zero based line value
         * @param anchorChar a zero based character value
         * @param activeLine a zero based line value
         * @param activeChar a zero based character value
         */
        constructor(anchorLine: number, anchorChar: number, activeLine: number, activeChar: number);
    }

    /**
     * A snippet string is a template which allows to insert text
     * and to control the editor cursor when insertion happens.
     */
    export class SnippetString {

		/**
		 * The snippet string.
		 */
        value: string;

        constructor(value?: string);

		/**
		 * Builder-function that appends the given string to
		 * the [`value`](#SnippetString.value) of this snippet string.
		 *
		 * @param string A value to append 'as given'. The string will be escaped.
		 * @return This snippet string.
		 */
        appendText(string: string): SnippetString;

		/**
		 * Builder-function that appends a tabstop (`$1`, `$2` etc) to
		 * the [`value`](#SnippetString.value) of this snippet string.
		 *
		 * @param number The number of this tabstop, defaults to an auto-incremet
		 * value starting at 1.
		 * @return This snippet string.
		 */
        appendTabstop(number?: number): SnippetString;

		/**
		 * Builder-function that appends a placeholder (`${1:value}`) to
		 * the [`value`](#SnippetString.value) of this snippet string.
		 *
		 * @param value The value of this placeholder - either a string or a function
		 * with which a nested snippet can be created.
		 * @param number The number of this tabstop, defaults to an auto-incremet
		 * value starting at 1.
		 * @return This snippet string.
		 */
        appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): SnippetString;

		/**
		 * Builder-function that appends a variable (`${VAR}`) to
		 * the [`value`](#SnippetString.value) of this snippet string.
		 *
		 * @param name The name of the variable - excluding the `$`.
		 * @param defaultValue The default value which is used when the variable name cannot
		 * be resolved - either a string or a function with which a nested snippet can be created.
		 * @return This snippet string.
		 */
        appendVariable(name: string, defaultValue: string | ((snippet: SnippetString) => any)): SnippetString;
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
     * Represents an event the change in a text editor's options
     */
    export interface TextEditorOptionsChangeEvent {
        textEditor: TextEditor;

        options: TextEditorOptions;
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
      * Represents a handle to a set of decorations
      * sharing the same [styling options](#DecorationRenderOptions) in a [text editor](#TextEditor).
      *
      * To get an instance of a `TextEditorDecorationType` use
      * [createTextEditorDecorationType](#window.createTextEditorDecorationType).
      */
    export interface TextEditorDecorationType {

		/**
		 * Internal representation of the handle.
		 */
        readonly key: string;

		/**
		 * Remove this decoration type and all decorations on all text editors using it.
		 */
        dispose(): void;
    }

    /**
     * The MarkdownString represents human readable text that supports formatting via the
     * markdown syntax. Standard markdown is supported, also tables, but no embedded html.
     */
    export class MarkdownString {

		/**
		 * The markdown string.
		 */
        value: string;

		/**
		 * Indicates that this markdown string is from a trusted source. Only *trusted*
		 * markdown supports links that execute commands, e.g. `[Run it](command:myCommandId)`.
		 */
        isTrusted?: boolean;

		/**
		 * Creates a new markdown string with the given value.
		 *
		 * @param value Optional, initial value.
		 */
        constructor(value?: string);

		/**
		 * Appends and escapes the given string to this markdown string.
		 * @param value Plain text.
		 */
        appendText(value: string): MarkdownString;

		/**
		 * Appends the given string 'as is' to this markdown string.
		 * @param value Markdown string.
		 */
        appendMarkdown(value: string): MarkdownString;

		/**
		 * Appends the given string as codeblock using the provided language.
		 * @param value A code snippet.
		 * @param language An optional [language identifier](#languages.getLanguages).
		 */
        appendCodeblock(value: string, language?: string): MarkdownString;
    }

	/**
	 * ~~MarkedString can be used to render human readable text. It is either a markdown string
	 * or a code-block that provides a language and a code snippet. Note that
	 * markdown strings will be sanitized - that means html will be escaped.~~
	 *
	 * @deprecated This type is deprecated, please use [`MarkdownString`](#MarkdownString) instead.
	 */
    export type MarkedString = MarkdownString | string | { language: string; value: string }; // keep for compatibility reason

    export interface ThemableDecorationAttachmentRenderOptions {
		/**
		 * Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.
		 */
        contentText?: string;
		/**
		 * An **absolute path** or an URI to an image to be rendered in the attachment. Either an icon
		 * or a text can be shown, but not both.
		 */
        contentIconPath?: string | Uri;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        border?: string;
		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        borderColor?: string | ThemeColor;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        fontStyle?: string;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        fontWeight?: string;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        textDecoration?: string;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        color?: string | ThemeColor;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        backgroundColor?: string | ThemeColor;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        margin?: string;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        width?: string;
		/**
		 * CSS styling property that will be applied to the decoration attachment.
		 */
        height?: string;
    }

    export interface ThemableDecorationInstanceRenderOptions {
		/**
		 * Defines the rendering options of the attachment that is inserted before the decorated text
		 */
        before?: ThemableDecorationAttachmentRenderOptions;

		/**
		 * Defines the rendering options of the attachment that is inserted after the decorated text
		 */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    export interface DecorationInstanceRenderOptions extends ThemableDecorationInstanceRenderOptions {
		/**
		 * Overwrite options for light themes.
		 */
        light?: ThemableDecorationInstanceRenderOptions;

		/**
		 * Overwrite options for dark themes.
		 */
        dark?: ThemableDecorationInstanceRenderOptions;
    }

    /**
      * Represents options for a specific decoration in a [decoration set](#TextEditorDecorationType).
      */
    export interface DecorationOptions {

		/**
		 * Range to which this decoration is applied. The range must not be empty.
		 */
        range: Range;

		/**
		 * A message that should be rendered when hovering over the decoration.
		 */
        hoverMessage?: MarkedString | MarkedString[];

		/**
		 * Render options applied to the current decoration. For performance reasons, keep the
		 * number of decoration specific options small, and use decoration types whereever possible.
		 */
        renderOptions?: DecorationInstanceRenderOptions;
    }

    /**
 * Represents theme specific rendering styles for a [text editor decoration](#TextEditorDecorationType).
 */
    export interface ThemableDecorationRenderOptions {
		/**
		 * Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
		 * Alternatively a color from the color registry can be [referenced](#ThemeColor).
		 */
        backgroundColor?: string | ThemeColor;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        outline?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'outline' for setting one or more of the individual outline properties.
		 */
        outlineColor?: string | ThemeColor;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'outline' for setting one or more of the individual outline properties.
		 */
        outlineStyle?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'outline' for setting one or more of the individual outline properties.
		 */
        outlineWidth?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        border?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'border' for setting one or more of the individual border properties.
		 */
        borderColor?: string | ThemeColor;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'border' for setting one or more of the individual border properties.
		 */
        borderRadius?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'border' for setting one or more of the individual border properties.
		 */
        borderSpacing?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'border' for setting one or more of the individual border properties.
		 */
        borderStyle?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 * Better use 'border' for setting one or more of the individual border properties.
		 */
        borderWidth?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        fontStyle?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        fontWeight?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        textDecoration?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        cursor?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        color?: string | ThemeColor;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        opacity?: string;

		/**
		 * CSS styling property that will be applied to text enclosed by a decoration.
		 */
        letterSpacing?: string;

		/**
		 * An **absolute path** or an URI to an image to be rendered in the gutter.
		 */
        gutterIconPath?: string | Uri;

		/**
		 * Specifies the size of the gutter icon.
		 * Available values are 'auto', 'contain', 'cover' and any percentage value.
		 * For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
		 */
        gutterIconSize?: string;

		/**
		 * The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
		 */
        overviewRulerColor?: string | ThemeColor;

		/**
		 * Defines the rendering options of the attachment that is inserted before the decorated text
		 */
        before?: ThemableDecorationAttachmentRenderOptions;

		/**
		 * Defines the rendering options of the attachment that is inserted after the decorated text
		 */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    /**
     * Describes the behavior of decorations when typing/editing at their edges.
     */
    export enum DecorationRangeBehavior {
		/**
		 * The decoration's range will widen when edits occur at the start or end.
		 */
        OpenOpen = 0,
		/**
		 * The decoration's range will not widen when edits occur at the start of end.
		 */
        ClosedClosed = 1,
		/**
		 * The decoration's range will widen when edits occur at the start, but not at the end.
		 */
        OpenClosed = 2,
		/**
		 * The decoration's range will widen when edits occur at the end, but not at the start.
		 */
        ClosedOpen = 3
    }

    /**
     * Represents different positions for rendering a decoration in an [overview ruler](#DecorationRenderOptions.overviewRulerLane).
     * The overview ruler supports three lanes.
     */
    export enum OverviewRulerLane {
        Left = 1,
        Center = 2,
        Right = 4,
        Full = 7
    }

    /**
     * Represents rendering styles for a [text editor decoration](#TextEditorDecorationType).
     */
    export interface DecorationRenderOptions extends ThemableDecorationRenderOptions {
		/**
		 * Should the decoration be rendered also on the whitespace after the line text.
		 * Defaults to `false`.
		 */
        isWholeLine?: boolean;

		/**
		 * Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.
		 * Defaults to `DecorationRangeBehavior.OpenOpen`.
		 */
        rangeBehavior?: DecorationRangeBehavior;

		/**
		 * The position in the overview ruler where the decoration should be rendered.
		 */
        overviewRulerLane?: OverviewRulerLane;

		/**
		 * Overwrite options for light themes.
		 */
        light?: ThemableDecorationRenderOptions;

		/**
		 * Overwrite options for dark themes.
		 */
        dark?: ThemableDecorationRenderOptions;
    }

    /**
     * Represents different [reveal](#TextEditor.revealRange) strategies in a text editor.
     */
    export enum TextEditorRevealType {
		/**
		 * The range will be revealed with as little scrolling as possible.
		 */
        Default = 0,
		/**
		 * The range will always be revealed in the center of the viewport.
		 */
        InCenter = 1,
		/**
		 * If the range is outside the viewport, it will be revealed in the center of the viewport.
		 * Otherwise, it will be revealed with as little scrolling as possible.
		 */
        InCenterIfOutsideViewport = 2,
		/**
		 * The range will always be revealed at the top of the viewport.
		 */
        AtTop = 3
    }

    /**
     * Represents a text editor.
     */
    export interface TextEditor {
        /**
		 * The document associated with this text editor. The document will be the same for the entire lifetime of this text editor.
		 */
        readonly document: TextDocument;

		/**
		 * The primary selection on this text editor. Shorthand for `TextEditor.selections[0]`.
		 */
        selection: Selection;

		/**
		 * The selections in this text editor. The primary selection is always at index 0.
		 */
        selections: Selection[];

		/**
		 * The current visible ranges in the editor (vertically).
		 * This accounts only for vertical scrolling, and not for horizontal scrolling.
		 */
        readonly visibleRanges: Range[];

		/**
		 * Text editor options.
		 */
        options: TextEditorOptions;

		/**
		 * The column in which this editor shows. Will be `undefined` in case this
		 * isn't one of the three main editors, e.g an embedded editor.
		 */
        viewColumn?: ViewColumn;

		/**
		 * Perform an edit on the document associated with this text editor.
		 *
		 * The given callback-function is invoked with an [edit-builder](#TextEditorEdit) which must
		 * be used to make edits. Note that the edit-builder is only valid while the
		 * callback executes.
		 *
		 * @param callback A function which can create edits using an [edit-builder](#TextEditorEdit).
		 * @param options The undo/redo behavior around this edit. By default, undo stops will be created before and after this edit.
		 * @return A promise that resolves with a value indicating if the edits could be applied.
		 */
        edit(callback: (editBuilder: TextEditorEdit) => void, options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Promise<boolean>;

		/**
		 * Insert a [snippet](#SnippetString) and put the editor into snippet mode. "Snippet mode"
		 * means the editor adds placeholders and additionals cursors so that the user can complete
		 * or accept the snippet.
		 *
		 * @param snippet The snippet to insert in this edit.
		 * @param location Position or range at which to insert the snippet, defaults to the current editor selection or selections.
		 * @param options The undo/redo behavior around this edit. By default, undo stops will be created before and after this edit.
		 * @return A promise that resolves with a value indicating if the snippet could be inserted. Note that the promise does not signal
		 * that the snippet is completely filled-in or accepted.
		 */
        insertSnippet(snippet: SnippetString, location?: Position | Range | Position[] | Range[], options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): Promise<boolean>;

		/**
		 * Adds a set of decorations to the text editor. If a set of decorations already exists with
		 * the given [decoration type](#TextEditorDecorationType), they will be replaced.
		 *
		 * @see [createTextEditorDecorationType](#window.createTextEditorDecorationType).
		 *
		 * @param decorationType A decoration type.
		 * @param rangesOrOptions Either [ranges](#Range) or more detailed [options](#DecorationOptions).
		 */
        setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;

		/**
		 * Scroll as indicated by `revealType` in order to reveal the given range.
		 *
		 * @param range A range.
		 * @param revealType The scrolling strategy for revealing `range`.
		 */
        revealRange(range: Range, revealType?: TextEditorRevealType): void;
    }

    /**
     *
     */
    export interface TextEditorEdit {
        /**
		 * Replace a certain text region with a new value.
		 * You can use \r\n or \n in `value` and they will be normalized to the current [document](#TextDocument).
		 *
		 * @param location The range this operation should remove.
		 * @param value The new text this operation should insert after removing `location`.
		 */
        replace(location: Position | Range | Selection, value: string): void;

		/**
		 * Insert text at a location.
		 * You can use \r\n or \n in `value` and they will be normalized to the current [document](#TextDocument).
		 * Although the equivalent text edit can be made with [replace](#TextEditorEdit.replace), `insert` will produce a different resulting selection (it will get moved).
		 *
		 * @param location The position where the new text should be inserted.
		 * @param value The new text this operation should insert.
		 */
        insert(location: Position, value: string): void;

		/**
		 * Delete a certain text region.
		 *
		 * @param location The range this operation should remove.
		 */
        delete(location: Range | Selection): void;

		/**
		 * Set the end of line sequence.
		 *
		 * @param endOfLine The new end of line for the [document](#TextDocument).
		 */
        setEndOfLine(endOfLine: EndOfLine): void;
    }

    /**
	 * Represents a line of text, such as a line of source code.
	 *
	 * TextLine objects are __immutable__. When a [document](#TextDocument) changes,
	 * previously retrieved lines will not represent the latest state.
	 */
    export interface TextLine {
        /**
         * The zero-based line number.
         */
        readonly lineNumber: number;

		/**
		 * The text of this line without the line separator characters.
		 */
        readonly text: string;

		/**
		 * The range this line covers without the line separator characters.
		 */
        readonly range: Range;

		/**
		 * The range this line covers with the line separator characters.
		 */
        readonly rangeIncludingLineBreak: Range;

		/**
		 * The offset of the first character which is not a whitespace character as defined
		 * by `/\s/`. **Note** that if a line is all whitespaces the length of the line is returned.
		 */
        readonly firstNonWhitespaceCharacterIndex: number;

		/**
		 * Whether this line is whitespace only, shorthand
		 * for [TextLine.firstNonWhitespaceCharacterIndex](#TextLine.firstNonWhitespaceCharacterIndex) === [TextLine.text.length](#TextLine.text).
		 */
        readonly isEmptyOrWhitespace: boolean;
    }

    /**
     * Represents an end of line character sequence in a [document](#TextDocument).
     */
    export enum EndOfLine {
		/**
		 * The line feed `\n` character.
		 */
        LF = 1,
		/**
		 * The carriage return line feed `\r\n` sequence.
		 */
        CRLF = 2
    }

    /**
	 * A universal resource identifier representing either a file on disk
	 * or another resource, like untitled resources.
	 */
    export class Uri {

		/**
		 * Create an URI from a file system path. The [scheme](#Uri.scheme)
		 * will be `file`.
		 *
		 * @param path A file system or UNC path.
		 * @return A new Uri instance.
		 */
        static file(path: string): Uri;

		/**
		 * Create an URI from a string. Will throw if the given value is not
		 * valid.
		 *
		 * @param value The string value of an Uri.
		 * @return A new Uri instance.
		 */
        static parse(value: string): Uri;

		/**
		 * Use the `file` and `parse` factory functions to create new `Uri` objects.
		 */
        private constructor(scheme: string, authority: string, path: string, query: string, fragment: string);

		/**
		 * Scheme is the `http` part of `http://www.msft.com/some/path?query#fragment`.
		 * The part before the first colon.
		 */
        readonly scheme: string;

		/**
		 * Authority is the `www.msft.com` part of `http://www.msft.com/some/path?query#fragment`.
		 * The part between the first double slashes and the next slash.
		 */
        readonly authority: string;

		/**
		 * Path is the `/some/path` part of `http://www.msft.com/some/path?query#fragment`.
		 */
        readonly path: string;

		/**
		 * Query is the `query` part of `http://www.msft.com/some/path?query#fragment`.
		 */
        readonly query: string;

		/**
		 * Fragment is the `fragment` part of `http://www.msft.com/some/path?query#fragment`.
		 */
        readonly fragment: string;

		/**
		 * The string representing the corresponding file system path of this Uri.
		 *
		 * Will handle UNC paths and normalize windows drive letters to lower-case. Also
		 * uses the platform specific path separator. Will *not* validate the path for
		 * invalid characters and semantics. Will *not* look at the scheme of this Uri.
		 */
        readonly fsPath: string;

		/**
		 * Derive a new Uri from this Uri.
		 *
		 * ```ts
		 * let file = Uri.parse('before:some/file/path');
		 * let other = file.with({ scheme: 'after' });
		 * assert.ok(other.toString() === 'after:some/file/path');
		 * ```
		 *
		 * @param change An object that describes a change to this Uri. To unset components use `null` or
		 *  the empty string.
		 * @return A new Uri that reflects the given change. Will return `this` Uri if the change
		 *  is not changing anything.
		 */
        with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;

		/**
		 * Returns a string representation of this Uri. The representation and normalization
		 * of a URI depends on the scheme. The resulting string can be safely used with
		 * [Uri.parse](#Uri.parse).
		 *
		 * @param skipEncoding Do not percentage-encode the result, defaults to `false`. Note that
		 *	the `#` and `?` characters occuring in the path will always be encoded.
		 * @returns A string representation of this Uri.
		 */
        toString(skipEncoding?: boolean): string;

		/**
		 * Returns a JSON representation of this Uri.
		 *
		 * @return An object.
		 */
        toJSON(): any;
    }

    /**
	 * Represents a text document, such as a source file. Text documents have
	 * [lines](#TextLine) and knowledge about an underlying resource like a file.
	 */
    export interface TextDocument {
        /**
		 * The associated uri for this document.
		 *
		 * *Note* that most documents use the `file`-scheme, which means they are files on disk. However, **not** all documents are
		 * saved on disk and therefore the `scheme` must be checked before trying to access the underlying file or siblings on disk.
		 *
		 * @see [FileSystemProvider](#FileSystemProvider)
		 * @see [TextDocumentContentProvider](#TextDocumentContentProvider)
		 */
        readonly uri: Uri;

		/**
		 * The file system path of the associated resource. Shorthand
		 * notation for [TextDocument.uri.fsPath](#TextDocument.uri). Independent of the uri scheme.
		 */
        readonly fileName: string;

		/**
		 * Is this document representing an untitled file which has never been saved yet. *Note* that
		 * this does not mean the document will be saved to disk, use [`uri.scheme`](#Uri.scheme)
		 * to figure out where a document will be [saved](#FileSystemProvider), e.g. `file`, `ftp` etc.
		 */
        readonly isUntitled: boolean;

		/**
		 * The identifier of the language associated with this document.
		 */
        readonly languageId: string;

		/**
		 * The version number of this document (it will strictly increase after each
		 * change, including undo/redo).
		 */
        readonly version: number;

		/**
		 * `true` if there are unpersisted changes.
		 */
        readonly isDirty: boolean;

		/**
		 * `true` if the document have been closed. A closed document isn't synchronized anymore
		 * and won't be re-used when the same resource is opened again.
		 */
        readonly isClosed: boolean;

		/**
		 * Save the underlying file.
		 *
		 * @return A promise that will resolve to true when the file
		 * has been saved. If the file was not dirty or the save failed,
		 * will return false.
		 */
        save(): Promise<boolean>;

		/**
		 * The [end of line](#EndOfLine) sequence that is predominately
		 * used in this document.
		 */
        readonly eol: EndOfLine;

		/**
		 * The number of lines in this document.
		 */
        readonly lineCount: number;

		/**
		 * Returns a text line denoted by the line number. Note
		 * that the returned object is *not* live and changes to the
		 * document are not reflected.
		 *
		 * @param line A line number in [0, lineCount).
		 * @return A [line](#TextLine).
		 */
        lineAt(line: number): TextLine;

		/**
		 * Returns a text line denoted by the position. Note
		 * that the returned object is *not* live and changes to the
		 * document are not reflected.
		 *
		 * The position will be [adjusted](#TextDocument.validatePosition).
		 *
		 * @see [TextDocument.lineAt](#TextDocument.lineAt)
		 * @param position A position.
		 * @return A [line](#TextLine).
		 */
        lineAt(position: Position): TextLine;

		/**
		 * Converts the position to a zero-based offset.
		 *
		 * The position will be [adjusted](#TextDocument.validatePosition).
		 *
		 * @param position A position.
		 * @return A valid zero-based offset.
		 */
        offsetAt(position: Position): number;

		/**
		 * Converts a zero-based offset to a position.
		 *
		 * @param offset A zero-based offset.
		 * @return A valid [position](#Position).
		 */
        positionAt(offset: number): Position;

		/**
		 * Get the text of this document. A substring can be retrieved by providing
		 * a range. The range will be [adjusted](#TextDocument.validateRange).
		 *
		 * @param range Include only the text included by the range.
		 * @return The text inside the provided range or the entire text.
		 */
        getText(range?: Range): string;

		/**
		 * Get a word-range at the given position. By default words are defined by
		 * common separators, like space, -, _, etc. In addition, per languge custom
		 * [word definitions](#LanguageConfiguration.wordPattern) can be defined. It
		 * is also possible to provide a custom regular expression.
		 *
		 * * *Note 1:* A custom regular expression must not match the empty string and
		 * if it does, it will be ignored.
		 * * *Note 2:* A custom regular expression will fail to match multiline strings
		 * and in the name of speed regular expressions should not match words with
		 * spaces. Use [`TextLine.text`](#TextLine.text) for more complex, non-wordy, scenarios.
		 *
		 * The position will be [adjusted](#TextDocument.validatePosition).
		 *
		 * @param position A position.
		 * @param regex Optional regular expression that describes what a word is.
		 * @return A range spanning a word, or `undefined`.
		 */
        getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;

		/**
		 * Ensure a range is completely contained in this document.
		 *
		 * @param range A range.
		 * @return The given range or a new, adjusted range.
		 */
        validateRange(range: Range): Range;

		/**
		 * Ensure a position is contained in the range of this document.
		 *
		 * @param position A position.
		 * @return The given position or a new, adjusted position.
		 */
        validatePosition(position: Position): Position;
    }

    export interface TextDocumentChangeEvent {
        document: TextDocument;

        contentChanges: TextDocumentContentChangeEvent[];
    }

    export interface TextDocumentContentChangeEvent {
        range: Range;
        /**
		 * The offset of the range that got replaced.
		 */
        rangeOffset: number;
		/**
		 * The length of the range that got replaced.
		 */
        rangeLength: number;
        /**
		 * The new text for the range.
		 */
        text: string;
    }

	/**
	 * Rendering style of the cursor.
	 */
    export enum TextEditorCursorStyle {
		/**
		 * Render the cursor as a vertical thick line.
		 */
        Line = 1,
		/**
		 * Render the cursor as a block filled.
		 */
        Block = 2,
		/**
		 * Render the cursor as a thick horizontal line.
		 */
        Underline = 3,
		/**
		 * Render the cursor as a vertical thin line.
		 */
        LineThin = 4,
		/**
		 * Render the cursor as a block outlined.
		 */
        BlockOutline = 5,
		/**
		 * Render the cursor as a thin horizontal line.
		 */
        UnderlineThin = 6
    }

	/**
	 * Rendering style of the line numbers.
	 */
    export enum TextEditorLineNumbersStyle {
		/**
		 * Do not render the line numbers.
		 */
        Off = 0,
		/**
		 * Render the line numbers.
		 */
        On = 1,
		/**
		 * Render the line numbers with values relative to the primary cursor location.
		 */
        Relative = 2
    }

    /**
     * Represents a text editor's options
     */
    export interface TextEditorOptions {
        /**
		 * The size in spaces a tab takes. This is used for two purposes:
		 *  - the rendering width of a tab character;
		 *  - the number of spaces to insert when [insertSpaces](#TextEditorOptions.insertSpaces) is true.
		 *
		 * When getting a text editor's options, this property will always be a number (resolved).
		 * When setting a text editor's options, this property is optional and it can be a number or `"auto"`.
		 */
        tabSize?: number | string;

		/**
		 * When pressing Tab insert [n](#TextEditorOptions.tabSize) spaces.
		 * When getting a text editor's options, this property will always be a boolean (resolved).
		 * When setting a text editor's options, this property is optional and it can be a boolean or `"auto"`.
		 */
        insertSpaces?: boolean | string;

		/**
		 * The rendering style of the cursor in this editor.
		 * When getting a text editor's options, this property will always be present.
		 * When setting a text editor's options, this property is optional.
		 */
        cursorStyle?: TextEditorCursorStyle;

		/**
		 * Render relative line numbers w.r.t. the current line number.
		 * When getting a text editor's options, this property will always be present.
		 * When setting a text editor's options, this property is optional.
		 */
        lineNumbers?: TextEditorLineNumbersStyle;
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
        readonly onCancellationRequested: Event<any>;


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
     * Represents the alignment of status bar items.
     */
    export enum StatusBarAlignment {

        /**
         * Aligned to the left side.
         */
        Left = 1,

        /**
         * Aligned to the right side.
         */
        Right = 2
    }

    /**
     * A status bar item is a status bar contribution that can
     * show text and icons and run a command on click.
     */
    export interface StatusBarItem {

        /**
         * The alignment of this item.
         */
        readonly alignment: StatusBarAlignment;

        /**
         * The priority of this item. Higher value means the item should
         * be shown more to the left.
         */
        readonly priority: number;

        /**
         * The text to show for the entry. To set a text with icon use the following pattern in text string:
         * $(fontawesomeClasssName)
         */
        text: string;

        /**
         * The tooltip text when you hover over this entry.
         */
        tooltip: string | undefined;

        /**
         * The foreground color for this entry.
         */
        color: string | ThemeColor | undefined;

        /**
         * The identifier of a command to run on click.
         */
        command: string | undefined;

        /**
         * Shows the entry in the status bar.
         */
        show(): void;

        /**
         * Hide the entry in the status bar.
         */
        hide(): void;

        /**
         * Dispose and free associated resources. Hide the entry in the status bar.
         */
        dispose(): void;
    }

    /**
     * A reference to one of the workbench colors.
     * Using a theme color is preferred over a custom color as it gives theme authors and users the possibility to change the color.
     */
    export class ThemeColor {
        /**
         * Creates a reference to a theme color.
         */
        constructor(id: string);
    }

    /**
     * Represents the state of a window.
     */
    export interface WindowState {
        /**
         * Whether the current window is focused.
         */
        readonly focused: boolean;
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
        export function showQuickPick(items: string[] | PromiseLike<string[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<string | undefined>;

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
        export function showQuickPick<T extends QuickPickItem>(items: T[] | PromiseLike<T[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<T | undefined>;

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

        /**
         * Represents the current window's state.
         *
         * @readonly
         */
        export let state: WindowState;

        /**
         * An event which fires when the focus state of the current window changes.
         * The value of the event represents whether the window is focused.
         */
        export const onDidChangeWindowState: Event<WindowState>;

        /**
         * Create a TextEditorDecorationType that can be used to add decorations to text editors.
         *
         * @param options Rendering options for the decoration type.
         * @return A new decoration type instance.
         */
        export function createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string): Disposable;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @param hideAfterTimeout Timeout in milliseconds after which the message will be disposed.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string, hideAfterTimeout: number): Disposable;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @param hideWhenDone PromiseLike on which completion (resolve or reject) the message will be disposed.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string, hideWhenDone: PromiseLike<any>): Disposable;

        /**
         * Creates a status bar [item](#StatusBarItem).
         *
         * @param alignment The alignment of the item.
         * @param priority The priority of the item. Higher values mean the item should be shown more to the left.
         * @return A new status bar item.
         */
        export function createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem;

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

    export namespace env {
        /**
         * Gets environment variable value by name.
         *
         * @param envVarName name of environment variable to get
         * @returns value of the given environment variable name or undefined if there is no such variable.
         */
        export function getEnvVariable(envVarName: string): PromiseLike<string | undefined>;

        /**
         * Gets query parameter value by name.
         *
         * @param queryParamName name of query parameter to get.
         * @returns value of the given query parameter or undefined if there is no such variable.
         */
        export function getQueryParameter(queryParamName: string): string | string[] | undefined;

        /**
         * Returns all query parameters of current IDE.
         */
        export function getQueryParameters(): { [key: string]: string | string[] } | undefined;
    }

}
