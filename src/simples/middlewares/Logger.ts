import { Middleware, IMiddleware, Application, Configuration } from '../../index';
import { IContainer, Injectable } from 'type-autofac';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {

    }

    setup() {
        this.app.use(async (ctx, next) => {
            let begin = new Date();
            console.log('begin at:', begin);
            await next();
            let end = new Date();

            console.log('begin at:', begin, ', end at:', end, ctx.req);
        });
    }

}
