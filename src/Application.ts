import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired, Inject } from 'type-autofac';
import { ContainerSymbol } from './index';


/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@Singleton
export class Application extends Koa {

    @Inject(ContainerSymbol)
    container: IContainer;

}
