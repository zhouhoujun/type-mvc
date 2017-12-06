
import {
    DefaultLogMiddleware, DefaultContextMiddleware,
    DefaultContentMiddleware, DefaultSessionMiddleware,
    DefaultBodyParserMiddleware,
    DefaultCorsMiddleware,
    DefaultViewsMiddleware,
    DefaultJsonMiddleware

} from './middlewares';
import { IContainer } from 'tsioc';
import { symbols } from './util';
import { Router, ModelParser } from './router';
import { BaseController } from './BaseController';

export function registerDefaults(container: IContainer) {
    container.register(symbols.ContentMiddleware, DefaultContentMiddleware);
    container.register(symbols.ContextMiddleware, DefaultContextMiddleware);
    container.register(symbols.JsonMiddleware, DefaultJsonMiddleware);
    container.register(symbols.LogMiddleware, DefaultLogMiddleware);
    container.register(symbols.SessionMiddleware, DefaultSessionMiddleware);
    container.register(symbols.BodyParserMiddleware, DefaultBodyParserMiddleware);
    container.register(symbols.ViewsMiddleware, DefaultViewsMiddleware);
    container.register(symbols.CorsMiddleware, DefaultCorsMiddleware);
    container.register(ModelParser);
    container.register(BaseController);
    container.register(Router);
}
