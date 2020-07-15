import {
    TypeMetadata, IClassMethodDecorator, createClassMethodDecorator,
    ClassMethodDecorator, isString, isArray, Registration, createClassDecorator,
    ITypeDecorator, isNumber, ArgsIteratorAction, MetadataExtends, isUndefined,
    IMethodDecorator, createMethodDecorator, Type, isClass, isFunction
} from '@tsdi/ioc';
import { createDIModuleDecorator } from '@tsdi/boot';
import { routeSart } from './exps';
import { RequestMethodType, RequestMethod } from './RequestMethod';
import { MiddlewareType, IMiddleware } from './middlewares/IMiddleware';
import {
    ControllerMetadata, CorsMetadata, DeleteMetadata, RouteMetadata, GetMetadata,
    HeadMetadata, MiddlewareMetadata, MvcModuleMetadata, OptionsMetadata, PatchMetadata,
    PostMetadata, PutMetadata
} from './metadata';



/**
 * MvcModule decorator, use to define class as mvc Module.
 *
 * @export
 * @interface IMvcModuleDecorator
 * @extends {ITypeDecorator<T>}
 * @template T
 */
export interface IMvcModuleDecorator<T extends MvcModuleMetadata> extends ITypeDecorator<T> {
    /**
     * MvcModule decorator, use to define class as mvc Module.
     *
     * @MvcModule
     *
     * @param {T} [metadata] bootstrap metadate config.
     */
    (metadata: T): ClassDecorator;
}

/**
 * MvcModule Decorator, definde class as mvc module.
 *
 * @MvcModule
 */
export const MvcModule: IMvcModuleDecorator<MvcModuleMetadata> = createDIModuleDecorator<MvcModuleMetadata>('MvcModule', null, (metadata: MvcModuleMetadata) => {

    // static main.
    if (isClass(metadata.type) && isFunction(metadata.type['main'])) {
        setTimeout(() => {
            metadata.type['main'](metadata);
        }, 100);
    }
    return metadata;
}) as IMvcModuleDecorator<MvcModuleMetadata>;


/**
 * authorization metadata.
 */
export interface AuthorizationMetadata extends TypeMetadata {
    /**
     * middleware to auth.
     *
     * @type {MiddlewareType[]}
     * @memberof AuthorizationMetadata
     */
    middlewares?: MiddlewareType[];
    /**
     * role
     *
     * @type {string}
     * @memberof AuthorizationMetadata
     */
    role?: string;
}

/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 *
 * @export
 * @interface IAuthorizationDecorator
 * @extends {IClassMethodDecorator<T>}
 * @template T
 */
export interface IAuthorizationDecorator<T extends AuthorizationMetadata> extends IClassMethodDecorator<T> {
    /**
     * Authorization decorator, define class or method need auth check.
     *
     * @Authorization
     *
     * @param {string} [role] auth role.
     */
    (role?: string): ClassMethodDecorator;

    /**
     * Authorization decorator, define class or method need auth check.
     *
     * @Authorization
     *
     * @param {MvcMiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [role] auth role.
     */
    (middlewares: MiddlewareType[], role?: string): ClassMethodDecorator;
}


/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 */
export const Authorization: IAuthorizationDecorator<AuthorizationMetadata> = createClassMethodDecorator<AuthorizationMetadata>('Authorization',
    [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isArray(arg)) {
                ctx.metadata.middlewares = arg;
                ctx.next(next);
            } else {
                ctx.metadata.role = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.role = arg;
            }
        }
    ]) as IAuthorizationDecorator<AuthorizationMetadata>;



/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator<T extends ControllerMetadata> extends ITypeDecorator<T> {
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     *
     * @param {string} routePrefix route prefix of this controller.
     * @param {(Registration | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, provide?: Registration | symbol | string, alias?: string): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     *
     * @param {string} routePrefix route prefix of this controller.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {(Registration | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, middlewares: MiddlewareType[], provide?: Registration | symbol | string, alias?: string): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     */
    (target: Function): void;
}

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 */
export const Controller: IControllerDecorator<ControllerMetadata> =
    createClassDecorator<ControllerMetadata>('Controller', [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.routePrefix = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isArray(arg)) {
                ctx.metadata.middlewares = arg;
                ctx.next(next);
            } else {
                ctx.next(next, false);
            }
        }
    ], (meta) => {
        if (!routeSart.test(meta.routePrefix)) {
            meta.routePrefix = '/' + meta.routePrefix;
        }
    }, true) as IControllerDecorator<ControllerMetadata>;



/**
 * Cors Decorator, define controller class or controller method support cors request.
 * @Cors
 *
 * @export
 * @interface ICorsDecorator
 * @extends {IClassMethodDecorator<T>}
 * @template T
 */
export interface ICorsDecorator<T extends CorsMetadata> extends IClassMethodDecorator<T> {
    /**
     * Cors Decorator, define controller class or controller method support cors.
     * @Cors
     *
     * @param {(RequestMethodType | RequestMethodType[])} [allowMethods] allow request methods cors, 'Access-Control-Expose-Headers'.
     * @param {number} [maxAge] set cors cache max age,  Access-Control-Max-Age.
     * @param {(string | string[])} [allowHeaders] allow cors request headers, 'Access-Control-Request-Headers'.
     */
    (allowMethods?: RequestMethodType | RequestMethodType[], maxAge?: number, allowHeaders?: string | string[]): ClassMethodDecorator;

    /**
     * Cors Decorator, define controller class or controller method support cors.
     * @Cors
     *
     * @param {T} [metadata] define metadata.
     */
    (metadata: T): ClassMethodDecorator;
}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 * @param name
 * @param actions
 * @param metadataExtends
 */
export function createCorsDecorator<T extends CorsMetadata>(name: string,
    actions?: ArgsIteratorAction<T>[],
    metadataExtends?: MetadataExtends<T>): ICorsDecorator<T> {
    return createClassMethodDecorator<T>(name,
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.allowMethods = arg;
                    ctx.next(next);
                } else if (isArray(arg)) {
                    let allowMethods = arg as any[];
                    ctx.metadata.allowMethods = allowMethods.filter(m => !isUndefined(m) && m !== null);
                    ctx.next(next);
                }
            },
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.maxAge = arg;
                    ctx.next(next);
                }
            },
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isArray(arg)) {
                    let allowHeaders = arg as string[];
                    ctx.metadata.allowHeaders = allowHeaders.filter(h => !!h);
                    ctx.next(next);
                }
            }
        ], metadataExtends) as ICorsDecorator<T>

}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 */
export const Cors: ICorsDecorator<CorsMetadata> = createCorsDecorator('Cors');


export type MiddlewareDecorator = <TFunction extends Type<IMiddleware>>(target: TFunction) => TFunction | void;

/**
 * Middleware decorator, define the class as mvc Middleware.
 * @Middleware
 *
 * @export
 * @interface IMiddlewareDecorator
 * @template T
 */
export interface IMiddlewareDecorator<T extends MiddlewareMetadata> {
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     * @param {T} middleware middleware name singed for mvc.
     */
    (middleware: T): MiddlewareDecorator;
}

/**
 * Middleware Decorator, definde class as mvc middleware.
 *
 * @Middleware
 */
export const Middleware: IMiddlewareDecorator<MiddlewareMetadata> = createClassDecorator<MiddlewareMetadata>('Middleware',
    null,
    (metadata) => {
        metadata.singleton = true;
        if (metadata.name) {
            metadata.provide = metadata.name;
        }
        if (!metadata.scope) {
            metadata.scope = 'global';
        }
    }) as IMiddlewareDecorator<MiddlewareMetadata>;


/**
 * custom define Request method. route decorator type define.
 *
 * @export
 * @interface IRouteMethodDecorator
 * @template T
 */
export interface IRouteMethodDecorator<T extends RouteMetadata> extends IMethodDecorator<T> {
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     */
    (route: string): MethodDecorator;
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, method: RequestMethod): MethodDecorator;
    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, contentType: string, method?: RequestMethod): MethodDecorator;

    /**
     * route decorator. define the controller method as an route.
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     * @param {RequestMethod} [method] set request method.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string, method?: RequestMethod): MethodDecorator;
}

/**
 * create route decorator.
 *
 * @export
 * @template T
 * @param {RequestMethod} [method]
 * @param { MetadataExtends<T>} [metaExtends]
 */
export function createRouteDecorator<T extends RouteMetadata>(
    method?: RequestMethod,
    actions?: ArgsIteratorAction<T>[],
    metaExtends?: MetadataExtends<T>): IRouteMethodDecorator<T> {
    return createMethodDecorator<RouteMetadata>('Route',
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.route = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isArray(arg)) {
                    ctx.metadata.middlewares = arg;
                    ctx.next(next);
                } else if (isString(arg)) {
                    ctx.metadata.contentType = arg;
                    ctx.next(next);
                } else if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                } else {
                    ctx.metadata.contentType = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isNumber(arg)) {
                    ctx.metadata.method = arg;
                }
            }
        ],
        metadata => {
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            if (!routeSart.test(metadata.route)) {
                metadata.route = '/' + metadata.route;
            }
            if (method) {
                metadata.method = method;
            } else if (!metadata.method) {
                metadata.method = RequestMethod.Get;
            }
            return metadata;
        }) as IRouteMethodDecorator<T>;
}

/**
 * route decorator. define the controller method as an route.
 *
 * @Route
 */
export const Route: IRouteMethodDecorator<RouteMetadata> = createRouteDecorator<RouteMetadata>() as IRouteMethodDecorator<RouteMetadata>;



/**
 * Head decorator. define the route method as head.
 *
 * @Head
 *
 * @export
 * @interface IHeadDecorator
 * @template T
 */
export interface IHeadDecorator<T extends HeadMetadata> extends IMethodDecorator<T> {
    /**
     * Head decorator. define the route method as head.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Head decorator. define the route method as head.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}


/**
 * Head decorator. define the route method as head.
 *
 * @Head
 */
export const Head: IHeadDecorator<HeadMetadata> = createRouteDecorator<HeadMetadata>(RequestMethod.Head);


/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 *
 * @export
 * @interface IOptionsDecorator
 * @template T
 */
export interface IOptionsDecorator<T extends OptionsMetadata> extends IMethodDecorator<T> {
    /**
     * Options decorator. define the route method as an options.
     *
     * @Options
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
}

/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 */
export const Options: IOptionsDecorator<OptionsMetadata> = createRouteDecorator<OptionsMetadata>(RequestMethod.Options);


/**
 * Get decorator. define the route method as get.
 *
 * @Get
 *
 * @export
 * @interface IGetDecorator
 * @template T
 */
export interface IGetDecorator<T extends GetMetadata> extends IMethodDecorator<T> {
    /**
     * Get decorator. define the route method as get.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Get decorator. define the route method as get.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}

/**
 * Get decorator. define the route method as get.
 *
 * @Get
 */
export const Get: IGetDecorator<GetMetadata> = createRouteDecorator<GetMetadata>(RequestMethod.Get);



/**
 * Delete decorator. define the route method as delete.
 *
 * @Delete
 *
 * @export
 * @interface IDeleteDecorator
 * @template T
 */
export interface IDeleteDecorator<T extends DeleteMetadata> extends IMethodDecorator<T> {
    /**
     * Delete decorator. define the route method as delete.
     *
     * @Delete
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Delete decorator. define the route method as delete.
     *
     * @Delete
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;

}
/**
 * Delete decorator. define the route method as delete.
 *
 * @Delete
 */
export const Delete: IDeleteDecorator<DeleteMetadata> = createRouteDecorator<DeleteMetadata>(RequestMethod.Delete);



/**
 * Patch decorator. define the route method as an Patch.
 *
 * @Patch
 *
 * @export
 * @interface IPatchDecorator
 * @template T
 */
export interface IPatchDecorator<T extends PatchMetadata> extends IMethodDecorator<T> {
    /**
     * Patch decorator. define the route method as an Patch.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Patch decorator. define the route method as Patch.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}
/**
 * Patch decorator. define the route method as patch.
 *
 * @Patch
 */
export const Patch: IPatchDecorator<PatchMetadata> = createRouteDecorator<PatchMetadata>(RequestMethod.Patch);




/**
 * Post decorator. define the route method as an Post.
 *
 * @Post
 *
 * @export
 * @interface IPostDecorator
 * @template T
 */
export interface IPostDecorator<T extends PostMetadata> extends IMethodDecorator<T> {
    /**
     * Post decorator. define the route method as an Post.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
    /**
     * Post decorator. define the route method as Post.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}
/**
 * Post decorator. define the route method as post.
 *
 * @Post
 */
export const Post: IPostDecorator<PostMetadata> = createRouteDecorator<PostMetadata>(RequestMethod.Post);



/**
 * Put decorator. define the route method as an Put.
 *
 * @Put
 *
 * @export
 * @interface IPutDecorator
 * @template T
 */
export interface IPutDecorator<T extends PutMetadata> extends IMethodDecorator<T> {
    /**
     * Put decorator. define the route method as an Put.
     *
     * @Put
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Put decorator. define the route method as Put.
     *
     * @Put
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
}
/**
 * Put decorator. define the route method as put.
 *
 * @Put
 */
export const Put: IPutDecorator<PutMetadata> = createRouteDecorator<PutMetadata>(RequestMethod.Put);

