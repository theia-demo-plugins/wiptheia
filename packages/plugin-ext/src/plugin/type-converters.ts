/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { EditorPosition, Selection, Range } from "../api/plugin-api";
import * as theia from '@theia/plugin';
import * as types from './types-impl';
import URI from "@theia/core/lib/common/uri";

export function toViewColumn(ep?: EditorPosition): theia.ViewColumn | undefined {
    if (typeof ep !== 'number') {
        return undefined;
    }

    if (ep === EditorPosition.ONE) {
        return <number>types.ViewColumn.One;
    } else if (ep === EditorPosition.TWO) {
        return <number>types.ViewColumn.Two;
    } else if (ep === EditorPosition.THREE) {
        return <number>types.ViewColumn.Three;
    }

    return undefined;
}

export function toSelection(selection: Selection): types.Selection {
    const { selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn } = selection;
    const start = new types.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
    const end = new types.Position(positionLineNumber - 1, positionColumn - 1);
    return new types.Selection(start, end);
}

export function toRange(range: Range): types.Range {
    // if (!range) {
    //     return undefined;
    // }

    const { startLineNumber, startColumn, endLineNumber, endColumn } = range;
    return new types.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
}

export function toURI(data: types.UriComponents): URI {
    let result = new URI();
    if (data.scheme) {
        result = result.withScheme(data.scheme);
    } else {
        result = result.withoutScheme();
    }

    if (data.authority) {
        result = result.withAuthority(data.authority);
    } else {
        result = result.withoutAuthority();
    }

    if (data.path) {
        result = result.withPath(data.path);
    } else {
        result = result.withoutPath();
    }
    if (data.query) {
        result = result.withQuery(data.query);
    } else {
        result = result.withoutQuery();
    }

    if (data.fragment) {
        result = result.withPath(data.path);
    } else {
        result = result.withoutFragment();
    }

    return result;
}
