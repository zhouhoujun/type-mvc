
import {
    DefaultLogMiddleware, DefaultContextMiddleware,
    DefaultContentMiddleware, DefaultSessionMiddleware,
    DefaultBodyParserMiddleware
} from './middlewares';
import { IContainer } from 'type-autofac';
import { ContentMiddleware, ContextMiddleware, LogMiddleware, SessionMiddleware, BodyParserMiddleware, RouteMiddleware } from './util';
import { Router } from './router';


export function registerDefaults(container: IContainer) {
    container.register(ContentMiddleware, DefaultContentMiddleware);
    container.register(ContextMiddleware, DefaultContextMiddleware);
    container.register(LogMiddleware, DefaultLogMiddleware);
    container.register(SessionMiddleware, DefaultSessionMiddleware);
    container.register(BodyParserMiddleware, DefaultBodyParserMiddleware);
    container.register(Router);
}
