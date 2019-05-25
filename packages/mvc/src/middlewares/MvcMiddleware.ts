import { Handle, Handles, HandleType } from '@tsdi/boot';
import { IContext } from './IContext';
import { IMiddleware } from './IMiddleware';
import { isClass } from '@tsdi/ioc';


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


export class CompositeMiddleware extends Handles<IContext> {

    protected registerHandle(handle: HandleType<IContext>, setup?: boolean): this {
        if (isClass(handle)) {
            this.container.register(handle);
        }
        return this;
    }
}
