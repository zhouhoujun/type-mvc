import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { DIModule } from '@tsdi/boot';
import { ServerModule } from '@tsdi/platform-server';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';
import { ServerLogsModule } from '@tsdi/platform-server-logs';
import { KoaServer } from './KoaServer';
import { KoaConfigureRegister} from './KoaConfigureRegister';

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
        ViewsMiddleware,
        KoaConfigureRegister
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
        ViewsMiddleware,
        KoaConfigureRegister
    ]
})
export class KoaModule {
}
