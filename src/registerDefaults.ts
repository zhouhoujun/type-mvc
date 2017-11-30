
import {
    DefaultLogMiddleware, DefaultContextMiddleware,
    DefaultContentMiddleware, DefaultSessionMiddleware,
    DefaultBodyParserMiddleware
} from './middlewares';
import { IContainer } from 'tsioc';
import { symbols } from './util';
import { Router } from './router';


export function registerDefaults(container: IContainer) {
    container.register(symbols.ContentMiddleware, DefaultContentMiddleware);
    container.register(symbols.ContextMiddleware, DefaultContextMiddleware);
    container.register(symbols.LogMiddleware, DefaultLogMiddleware);
    container.register(symbols.SessionMiddleware, DefaultSessionMiddleware);
    container.register(symbols.BodyParserMiddleware, DefaultBodyParserMiddleware);
    container.register(Router);
}
