import * as Koa from 'koa';
import {
    BodyParserMiddleware, ContentMiddleware, ContextMiddleware,
    JsonMiddleware, LogMiddleware, SessionMiddleware, ViewsMiddleware
} from './middlewares';
import { MvcServerToken } from '@mvx/mvc';
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
        { provide: MvcServerToken, useClass: Koa }
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
