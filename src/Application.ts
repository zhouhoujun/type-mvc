import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject, symbols as iocSymbols } from 'tsioc';
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

    @Inject(iocSymbols.IContainer)
    container: IContainer;

}
