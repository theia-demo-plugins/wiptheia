/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as theia from '@theia/plugin';
import { ModelChangedEvent, DocumentsMain } from '../api/plugin-api';
import URI from '@theia/core/lib/common/uri';
import { ok } from './assert';

export class DocumentDataExt {

    private disposed = false;
    private dirty: boolean;
    private _document: theia.TextDocument;

    constructor(proxy: DocumentsMain, private uri: URI, lines: string[], eol: string,
        languageId: string, versionId: number, isDirty: boolean) {

    }

    dispose(): void {
        ok(!this.disposed);
        this.dirty = false;
        this.disposed = true;
    }

    onEvents(e: ModelChangedEvent): void {
        // TODO: implement this
    }
    acceptIsDirty(isDirty: boolean): void {
        ok(!this.disposed);
        this.dirty = isDirty;
    }
    acceptLanguageId(langId: string): void {
        throw new Error("Method not implemented.");
    }
    get document(): theia.TextDocument {
        if (!this._document) {
            const that = this;
            this._document = {
                get uri() { return that.uri; },
                get isDirty() { return that.dirty; }
            };
        }
        return Object.freeze(this._document);
    }
}
