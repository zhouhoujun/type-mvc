import { IContainer, Injectable, Inject, NonePointcut } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util';
import { IConfiguration } from '../../IConfiguration';

import * as json from 'koa-json';

@NonePointcut
@Middleware(mvcSymbols.JsonMiddleware)
export class DefaultJsonMiddleware implements IMiddleware {

    constructor(private app: Application, @Inject(mvcSymbols.IConfiguration) private config: IConfiguration) {
    }
    setup() {
        this.app.use(json());
    }

}
