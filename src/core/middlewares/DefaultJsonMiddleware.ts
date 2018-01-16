import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { Configuration } from '../../Configuration';

import * as json from 'koa-json';

@Middleware(mvcSymbols.JsonMiddleware)
export class DefaultJsonMiddleware implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {
    }
    setup() {
        this.app.use(json());
    }

}
