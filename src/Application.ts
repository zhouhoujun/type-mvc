import * as Koa from 'koa';
import { Injectable, Singleton } from 'type-autofac';

@Injectable
@Singleton
export class Application extends Koa {

}
