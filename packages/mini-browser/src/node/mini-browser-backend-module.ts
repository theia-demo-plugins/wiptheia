/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from 'inversify';
import { bindContributionProvider } from '@theia/core/lib/common/contribution-provider';
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common';
import { MiniBrowserService, MiniBrowserServicePath } from '../common/mini-browser-service';
import { MiniBrowserEndpoint, MiniBrowserEndpointHandler, HtmlHandler, ImageHandler, PdfHandler, SvgHandler } from './mini-browser-endpoint';

export default new ContainerModule(bind => {
    bind(MiniBrowserEndpoint).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(MiniBrowserEndpoint);
    bind(MiniBrowserService).toDynamicValue(context => context.container.get(MiniBrowserEndpoint));
    bind(ConnectionHandler).toDynamicValue(context => new JsonRpcConnectionHandler(MiniBrowserServicePath, () => context.container.get(MiniBrowserService))).inSingletonScope();
    bindContributionProvider(bind, MiniBrowserEndpointHandler);
    bind(MiniBrowserEndpointHandler).to(HtmlHandler).inSingletonScope();
    bind(MiniBrowserEndpointHandler).to(ImageHandler).inSingletonScope();
    bind(MiniBrowserEndpointHandler).to(PdfHandler).inSingletonScope();
    bind(MiniBrowserEndpointHandler).to(SvgHandler).inSingletonScope();
});
