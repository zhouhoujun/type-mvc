import * as Koa from 'koa';
import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { CoreServerToken } from '@mvx/mvc';
import { DIModule } from '@ts-ioc/bootstrap';

@DIModule({
    imports: [
        BodyParserMiddleware,
        ContentMiddleware,
        ContextMiddleware,
        JsonMiddleware,
        LogMiddleware,
        SessionMiddleware,
        ViewsMiddleware
    ],
    providers: [
        { provide: CoreServerToken, useClass: Koa }
    ],
    exports: [
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
