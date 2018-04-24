/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { QuickOpenMain, PickOptions, PickOpenItem, MAIN_RPC_CONTEXT, QuickOpenExt } from '../api/plugin-api';
import { InputBoxOptions } from '@theia/plugin';
import { interfaces } from 'inversify';
import { RPCProtocol } from '../api/rpc-protocol';
import { QuickOpenService } from '@theia/core/lib/browser/quick-open/quick-open-service';
import { QuickOpenModel, QuickOpenItem, QuickOpenMode } from '@theia/core/lib/browser/quick-open/quick-open-model';

export class QuickOpenMainImpl implements QuickOpenMain, QuickOpenModel {

    private doResolve: (value?: number | number[] | PromiseLike<number | number[]> | undefined) => void;
    private proxy: QuickOpenExt;
    private delegate: QuickOpenService;
    private acceptor: ((items: QuickOpenItem[]) => void) | undefined;
    private items: QuickOpenItem[] | undefined;

    constructor(rpc: RPCProtocol, container: interfaces.Container) {
        this.proxy = rpc.getProxy(MAIN_RPC_CONTEXT.QUICK_OPEN_EXT);
        this.delegate = container.get(QuickOpenService);
    }

    private cleanUp() {
        this.items = undefined;
        this.acceptor = undefined;
    }

    $show(options: PickOptions): PromiseLike<number | number[]> {

        this.delegate.open(this, {
            fuzzyMatchDescription: options.matchOnDescription,
            fuzzyMatchLabel: true,
            fuzzyMatchDetail: options.matchOnDetail,
            placeholder: options.placeHolder,
            onClose: () => {
                this.cleanUp();
            }
        });

        return new Promise((resolve, reject) => {
            this.doResolve = resolve;
        });

    }
    $setItems(items: PickOpenItem[]): PromiseLike<any> {
        this.items = [];
        for (const i of items) {
            this.items.push(new QuickOpenItem({
                label: i.label,
                description: i.description,
                detail: i.detail,
                run: mode => {
                    if (mode === QuickOpenMode.PREVIEW) {
                        this.proxy.$onItemSelected(i.handle);
                    } else if (mode === QuickOpenMode.OPEN) {
                        this.doResolve(i.handle);
                        this.cleanUp();
                    }
                    return true;
                }
            }));
        }
        if (this.acceptor) {
            this.acceptor(this.items);
        }
        return Promise.resolve();
    }
    $setError(error: Error): PromiseLike<any> {
        throw new Error("Method not implemented.");
    }
    $input(options: InputBoxOptions, validateInput: boolean): PromiseLike<string> {
        throw new Error("Method not implemented.");
    }

    onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
        this.acceptor = acceptor;
        if (this.items) {
            acceptor(this.items);
        }
    }
}
