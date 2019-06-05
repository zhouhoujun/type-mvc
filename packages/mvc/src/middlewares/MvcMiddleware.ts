import { Handle, Handles, HandleType } from '@tsdi/boot';
import { IContext } from './IContext';
import { IMiddleware } from './IMiddleware';
import { isClass, Injectable } from '@tsdi/ioc';


/**
 * middleware
 *
 * @export
 * @abstract
 * @class Middleware
 * @extends {Handle<MvcContext>}
 * @implements {IMiddleware}
 */
export abstract class MvcMiddleware extends Handle<IContext> implements IMiddleware {

}


@Injectable()
export class CompositeMiddleware extends Handles<IContext> {

    find(filter: (item: HandleType<IContext>) => boolean) {
        return this.handles.find(item => filter(item));
    }

    protected registerHandle(handle: HandleType<IContext>, setup?: boolean): this {
        if (isClass(handle)) {
            this.container.register(handle);
        }
        return this;
    }
}
