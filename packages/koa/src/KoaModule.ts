import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { DIModule } from '@ts-ioc/bootstrap';
import { KoaServer } from './KoaServer';

@DIModule({
    imports: [
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
