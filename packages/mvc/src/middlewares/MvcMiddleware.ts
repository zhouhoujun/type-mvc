import { Handle, Handles, HandleType } from '@tsdi/boot';
import { IContext } from '../IContext';
import { IMiddleware } from './IMiddleware';
import { isClass, Injectable } from '@tsdi/ioc';
import { isString } from 'util';


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

/**
 * composite middleware.
 *
 * @export
 * @class CompositeMiddleware
 * @extends {Handles<IContext>}
 */
@Injectable()
export class CompositeMiddleware extends Handles<IContext> {

    find(filter: (item: HandleType<IContext>) => boolean) {
        return this.handles.find(item => filter(item));
    }

    /**
     * use handle before
     *
     * @param {HandleType} handle
     * @param {HandleType} [before]
     * @returns {this}
     * @memberof LifeScope
     */
    useBefore(handle: HandleType<IContext>, before?: string | HandleType<IContext> | boolean, setup?: boolean): this {
        if (isString(before)) {
            let beforehdl = this.find((h: any) => h.middleName === before);
            super.useBefore(handle, beforehdl, setup);
        } else {
            super.useBefore(handle, before, setup)
        }
        return this;
    }
    /**
     * use handle after.
     *
     * @param {HandleType} handle
     * @param {HandleType} [after]
     * @returns {this}
     * @memberof LifeScope
     */
    useAfter(handle: HandleType<IContext>, after?: string | HandleType<IContext> | boolean, setup?: boolean): this {
        if (isString(after)) {
            let afterhdl = this.find((h: any) => h.middleName === after);
            super.useBefore(handle, afterhdl, setup);
        } else {
            super.useBefore(handle, after, setup)
        }
        return this;
    }

    protected registerHandle(handle: HandleType<IContext>, setup?: boolean): this {
        if (isClass(handle)) {
            this.container.register(handle);
        }
        return this;
    }
}
