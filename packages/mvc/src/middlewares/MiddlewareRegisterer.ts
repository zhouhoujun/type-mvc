import { Singleton } from '@tsdi/ioc';
import { MiddlewareType } from './IMiddleware';

@Singleton()
export class MiddlewareRegisterer extends Set<MiddlewareType> {

}
