import {
    InjectToken, Token, Inject, isClass, isToken,
    isFunction, isString, getTypeMetadata,
    lang, Injectable
} from '@tsdi/ioc';
import {
    OrderMiddleware, MiddlewareType,
    IMiddleware, DefaultMiddlewawreOrder
} from './IMiddleware';
import { MiddlewareMetadata } from '../metadata';
import { Middleware } from '../decorators';
import { IApplication } from '../IApplication';
import { IContainer, ContainerToken } from '@tsdi/core';



export interface IMiddlewareChain {

    container: IContainer;

    /**
     * setup middleware chain
     *
     * @param {IApplication} app
     * @memberof IMiddlewareChain
     */
    setup(app: IApplication): void;

    /**
     * use middleware
     *
     * @param {...MiddlewareType[]} middleware
     * @returns {this}
     * @memberof IMiddlewareChain
     */
    use(...middleware: MiddlewareType[]): this;

    /**
     * use middleware setup before one middleware.
     *
     * @param {MiddlewareType} middleware
     * @param {MiddlewareType} [match]
     * @returns {this}
     * @memberof IMiddlewareChain
     */
    useBefore(middleware: MiddlewareType, match?: MiddlewareType): this;

    /**
     * use middleware setup after one middleware.
     *
     * @param {MiddlewareType} middleware
     * @param {MiddlewareType} [match]
     * @returns {this}
     * @memberof IMiddlewareChain
     */
    useAfter(middleware: MiddlewareType, match?: MiddlewareType): this;
}

export const MiddlewareChainToken = new InjectToken<IMiddlewareChain>('middleware_chain')



@Injectable(MiddlewareChainToken)
export class MiddlewareChain implements IMiddlewareChain {

    @Inject(ContainerToken)
    public container: IContainer;

    private orders: OrderMiddleware[];
    constructor() {

    }

    setup(app: IApplication) {
        let server = app.getServer();
        this.orders.forEach(mdl => {
            let m = mdl.middleware;
            if (!m) {
                return;
            }

            if (isToken(m)) {
                let middleware = app.getHostBuilder().resolve(m);
                if (isFunction(middleware.setup)) {
                    middleware.setup(app);
                }
            } else if (isFunction(m)) {
                server.use(m);
            }
        });
    }

    use(...middleware: MiddlewareType[]) {
        if (!this.orders) {
            this.orders = this.getDefault();
        }
        middleware.forEach(mdl => {
            if (isToken(mdl)) {
                this.insert(mdl);
            } else if (isFunction(mdl)) {
                this.orders.push({ middleware: mdl });

            }
        });
        return this;
    }

    insert(middleware: Token<IMiddleware>, chain?: OrderMiddleware[]) {
        let meta = this.getMiddlewareMeta(middleware);
        if (meta) {
            this.insertByMeta(meta, middleware, chain);
        }
    }

    getMiddlewareMeta(middleware: Token<IMiddleware>): MiddlewareMetadata {
        let type = isClass(middleware) ? middleware : this.container.getTokenImpl(middleware);
        if (isClass(type)) {
            return lang.first(getTypeMetadata(Middleware, type));
        } else if (isString(middleware)) {
            return { name: middleware };
        } else {
            return null;
        }
    }

    insertByMeta(meta: MiddlewareMetadata, middleware: Token<IMiddleware>, chain?: OrderMiddleware[]) {
        chain = chain || this.orders;
        let ordMidd = { name: meta.name, middleware: middleware };
        if (chain.length < 1) {
            chain.push(ordMidd);
            return;
        }
        if (chain.some(m => m.name === meta.name)) {
            return;
        }

        let idx = chain.length;
        if (meta.before) {
            idx = chain.findIndex(v => v.name && v.name === meta.before);
        }
        if (meta.after) {
            idx = chain.findIndex(v => v.name && v.name === meta.after) + 1;
        }
        if (idx < 0 || idx >= chain.length) {
            chain.push(ordMidd)
        } else {
            chain.splice(idx, 0, ordMidd);
        }
    }

    useBefore(middleware: MiddlewareType, match?: MiddlewareType): this {
        if (match) {
            let bmeta = this.getMiddlewareMeta(match);
            let curMeta = this.getMiddlewareMeta(middleware);
            this.insertByMeta({ name: curMeta.name, before: bmeta.name }, middleware);
        } else {
            this.insert(middleware);
        }
        return this;
    }

    useAfter(middleware: MiddlewareType, match?: MiddlewareType): this {
        if (match) {
            let afmeta = this.getMiddlewareMeta(match);
            let curMeta = this.getMiddlewareMeta(middleware);
            this.insertByMeta({ name: curMeta.name, after: afmeta.name }, middleware);
        } else {
            this.insert(middleware);
        }
        return this;
    }

    protected getDefault() {
        let chain = [];
        DefaultMiddlewawreOrder.forEach(m => {
            this.insert(m, chain);
        });

        return chain;
    }

}

