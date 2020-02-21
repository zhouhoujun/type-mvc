import { isClass, Injectable, isString, Inject, INJECTOR, PromiseUtil, Action, isToken, isFunction } from '@tsdi/ioc';
import { Handle, Handles, HandleType } from '@tsdi/boot';
import { IContext } from '../IContext';
import { IMiddleware } from './IMiddleware';
import { ICoreInjector } from '@tsdi/core';


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
    @Inject(INJECTOR) injector: ICoreInjector;
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

    @Inject(INJECTOR) injector: ICoreInjector;

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
    useBefore(handle: HandleType<IContext>, before?: HandleType<IContext>): this {
        if (isString(before)) {
            let beforehdl = this.find((h: any) => h.middleName === before);
            super.useBefore(handle, beforehdl);
        } else {
            super.useBefore(handle, before)
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
    useAfter(handle: HandleType<IContext>, after?: HandleType<IContext>): this {
        if (isString(after)) {
            let afterhdl = this.find((h: any) => h.middleName === after);
            super.useBefore(handle, afterhdl);
        } else {
            super.useBefore(handle, after)
        }
        return this;
    }

    protected registerHandle(HandleType: HandleType<IContext>): this {
        if (isClass(HandleType)) {
            this.injector.registerType(HandleType);
        }
        return this;
    }

    protected toHandle(handleType: HandleType<IContext>): PromiseUtil.ActionHandle<IContext> {
        if (handleType instanceof Action) {
            return handleType.toAction() as PromiseUtil.ActionHandle<IContext>;
        } else if (isToken(handleType)) {
            return this.injector.get<Action>(handleType)?.toAction?.() as PromiseUtil.ActionHandle<IContext>;
        } else if (isFunction(handleType)) {
            return handleType as PromiseUtil.ActionHandle<IContext>;
        }
        return null;
    }
}
