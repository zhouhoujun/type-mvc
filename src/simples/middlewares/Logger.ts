import { Middleware, IMiddleware, Application, Configuration } from '../../index';
import { IContainer, Injectable } from 'type-autofac';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(app: Application, config: Configuration) {

    }

    setup() {

    }

}
