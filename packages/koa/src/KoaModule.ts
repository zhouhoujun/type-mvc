import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { DIModule } from '@ts-ioc/bootstrap';
import { ServerModule } from '@ts-ioc/platform-server';
import { ServerBootstrapModule } from '@ts-ioc/platform-server-bootstrap';
import { ServerLogsModule } from '@ts-ioc/platform-server-logs';
import { KoaServer } from './KoaServer';

@DIModule({
    imports: [
        ServerModule,
        ServerBootstrapModule,
        ServerLogsModule,
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
