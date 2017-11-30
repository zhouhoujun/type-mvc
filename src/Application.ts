import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject } from 'tsioc';
import { symbols } from './util';


/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@Singleton
export class Application extends Koa {

    @Inject(symbols.IContainer)
    container: IContainer;

}
