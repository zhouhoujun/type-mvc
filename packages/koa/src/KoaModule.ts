import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { DIModule } from '@ts-ioc/bootstrap';
import { ServerModule } from '@ts-ioc/platform-server';
import { ServerBootstrapModule } from '@ts-ioc/platform-server-bootstrap';
import { ServerLogsModule } from '@ts-ioc/platform-server-logs';

import { KoaServer } from './KoaServer';
import { MvcConfigureRegister } from './MvcConfigureRegister';

@DIModule({
    imports: [
        ServerModule,
        ServerBootstrapModule,
        ServerLogsModule,
        MvcConfigureRegister,
        KoaServer,
        BodyParserMiddleware,
        ContentMiddleware,
        ContextMiddleware,
        JsonMiddleware,
        LogMiddleware,
        SessionMiddleware,
        ViewsMiddleware
    ],
    exports: [
        ServerModule,
        ServerBootstrapModule,
        ServerLogsModule,
        MvcConfigureRegister,
        KoaServer,
        BodyParserMiddleware,
        ContentMiddleware,
        ContextMiddleware,
        JsonMiddleware,
        LogMiddleware,
        SessionMiddleware,
        ViewsMiddleware
    ]
})
export class KoaModule {
}
