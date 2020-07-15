import { MethodMetadata, ClassMetadata, TypeMetadata, Type, Modules } from '@tsdi/ioc';
import { DIModuleMetadata } from '@tsdi/boot';
import { RequestMethod } from './RequestMethod';
import { MiddlewareType, MvcMiddlewareType } from './middlewares/IMiddleware';
import { CorsOptions, IConfiguration } from './IConfiguration';
import { CompositeMiddleware, MvcMiddleware } from './middlewares/MvcMiddleware';
import { MvcContext } from './MvcContext';



/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {MethodMetadata}
 */
export interface IRouteMetadata extends MethodMetadata {
    /**
     * route.
     *
     * @type {string}
     * @memberof RouteMetadata
     */
    route?: string;

    /**
     * http content type.
     *
     * @type {string}
     * @memberof RouteMetadata
     */
    contentType?: string;
    /**
     * middlewares
     *
     * @type {MiddlewareType[]}
     * @memberof RouteMetadata
     */
    middlewares?: MiddlewareType[]
}

/**
 * route metadata.
 *
 * @export
 * @interface RouteMetadata
 * @extends {IRouteMetadata}
 */
export interface RouteMetadata extends IRouteMetadata {
    /**
     * request method.
     *
     * @type {RequestMethod}
     * @memberof RouteMetadata
     */
    method?: RequestMethod;
}

/**
 * get metadata.
 */
export interface GetMetadata extends IRouteMetadata {

}


/**
 * delete metadata
 */
export interface DeleteMetadata extends IRouteMetadata {

}

/**
 * head metadata
 */
export interface HeadMetadata extends IRouteMetadata {

}

/**
 * options metadata.
 */
export interface OptionsMetadata extends IRouteMetadata {

}

export interface PatchMetadata extends IRouteMetadata {

}

/**
 * post metadata.
 */
export interface PostMetadata extends IRouteMetadata {

}

/**
 * put metadata.
 */
export interface PutMetadata extends IRouteMetadata {

}

/**
 * controller metadata
 *
 * @export
 * @interface RouterMetadata
 * @extends {ClassMetadata}
 */
export interface RouterMetadata extends ClassMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof RouterMetadata
     */
    routePrefix?: string;
}



/**
 * middleware metadata.
 *
 * @export
 * @interface MiddlewareMetadata
 * @extends {ClassMetadata}
 */
export interface MiddlewareMetadata extends ClassMetadata {
    /**
     * define middleware name.
     *
     * @type {string}
     * @memberof MiddlewareMetadata
     */
    name?: string;

    /**
     * middleware used scope.
     *
     * @type {('global' | 'route')}
     * @memberof MiddlewareMetadata
     */
    scope?: 'global' | 'route';

    /**
     * the middleware reg in.
     *
     * @type {Type<CompositeMiddleware>}
     * @memberof MiddlewareMetadata
     */
    regIn?: Type<CompositeMiddleware>;
    /**
     * define middleware setup before one middleware.
     *
     * @type {(string | Type<MvcMiddleware>)}
     * @memberof MiddlewareMetadata
     */
    before?: string | Type<MvcMiddleware>;
    /**
     * define middleware setup after one middleware.
     *
     * @type {(string | Type<MvcMiddleware>)}
     * @memberof MiddlewareMetadata
     */
    after?: string | Type<MvcMiddleware>;
}


/**
 * controller metadata
 *
 * @export
 * @interface ControllerMetadata
 * @extends {ClassMetadata}
 */
export interface ControllerMetadata extends ClassMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof ControllerMetadata
     */
    routePrefix?: string;

    /**
     * the middlewares for the route.
     *
     * @type {MiddlewareType[]}
     * @memberof ControllerMetadata
     */
    middlewares?: MiddlewareType[];
}

/**
 * cors metadata.
 */
export interface CorsMetadata extends TypeMetadata, CorsOptions {

}


export interface MvcModuleMetadata extends DIModuleMetadata, IConfiguration {
    contextType?: Type<MvcContext>;
    middlewares?: MvcMiddlewareType[];
    controllers?: Modules[];
    passports?: any;
}
