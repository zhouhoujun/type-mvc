import { isClass, Injectable, isString, Inject, INJECTOR, Action, isToken, isFunction, AsyncHandler, InjectorProxyToken, InjectorProxy } from '@tsdi/ioc';
import { ICoreInjector } from '@tsdi/core';
import { Handle, Handles, HandleType } from '@tsdi/boot';
import { IContext } from '../IContext';
import { IMiddleware } from './IMiddleware';

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
    @Inject(InjectorProxyToken)
    private _injector: InjectorProxy<ICoreInjector>;

    /**
     * get injector of current message queue.
     */
    getInjector(): ICoreInjector {
        return this._injector();
    }

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
    @Inject(InjectorProxyToken)
    private _injector: InjectorProxy<ICoreInjector>;

    /**
     * get injector of current message queue.
     */
    getInjector(): ICoreInjector {
        return this._injector();
    }

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
            this.getInjector().registerType(HandleType);
        }
        return this;
    }

    protected toHandle(handleType: HandleType<IContext>): AsyncHandler<IContext> {
        if (handleType instanceof Action) {
            return handleType.toAction() as AsyncHandler<IContext>;
        } else if (isToken(handleType)) {
            return this.getInjector().get<Action>(handleType)?.toAction?.() as AsyncHandler<IContext>;
        } else if (isFunction(handleType)) {
            return handleType as AsyncHandler<IContext>;
        }
        return null;
    }
}
