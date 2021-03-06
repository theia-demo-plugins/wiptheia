/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export interface Disposable {
    dispose(): void;
}

export function dispose<T extends Disposable>(disposable: T): T | undefined;
export function dispose<T extends Disposable>(...disposables: T[]): T[] | undefined;
export function dispose<T extends Disposable>(disposables: T[]): T[] | undefined;
export function dispose<T extends Disposable>(first: T | T[], ...rest: T[]): T | T[] | undefined {
    if (Array.isArray(first)) {
        first.forEach(d => d && d.dispose());
        return [];
    } else if (rest.length === 0) {
        if (first) {
            first.dispose();
            return first;
        }
        return undefined;
    } else {
        dispose(first);
        dispose(rest);
        return [];
    }
}
