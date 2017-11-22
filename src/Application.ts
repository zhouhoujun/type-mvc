import * as Koa from 'koa';
import { Injectable, Singleton, IContainer, AutoWired } from 'type-autofac';
import { ContainerName } from './util';

@Injectable
@Singleton
export class Application extends Koa {

    @AutoWired(ContainerName)
    container: IContainer;

}
