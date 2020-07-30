import {
    TypeMetadata, createClassMethodDecorator,
    ClassMethodDecorator, isString, isArray, Registration, createClassDecorator,
    isNumber, ArgsIteratorAction, MetadataExtends, isUndefined,
    createMethodDecorator, Type, isClass, isFunction
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
 * @template T
 */
export interface IMvcModuleDecorator {
    /**
     * MvcModule decorator, use to define class as mvc Module.
     *
     * @MvcModule
     *
     * @param {MvcModuleMetadata} [metadata] bootstrap metadate config.
     */
    (metadata: MvcModuleMetadata): ClassDecorator;
}

/**
 * MvcModule Decorator, definde class as mvc module.
 *
 * @MvcModule
 */
export const MvcModule: IMvcModuleDecorator = createDIModuleDecorator<MvcModuleMetadata>('MvcModule', null, (metadata: MvcModuleMetadata) => {

    // static main.
    if (isClass(metadata.type) && isFunction(metadata.type['main'])) {
        setTimeout(() => {
            metadata.type['main'](metadata);
        }, 100);
    }
    return metadata;
}) as IMvcModuleDecorator;


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
export interface IAuthorizationDecorator {
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
     * @param {AuthorizationMetadata} [metadata] auth metadata.
     */
    (metadata: AuthorizationMetadata): ClassMethodDecorator;

    /**
     * Authorization decorator, define class or method need auth check.
     *
     * @Authorization
     *
     * @param {MvcMiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [role] auth role.
     */
    (middlewares: MiddlewareType[], role?: string): ClassMethodDecorator;

    /**
     * Authorization decorator, define class need auth check.
     *
     * @Authorization
     */
    (target: Type): void;
    /**
     * Authorization decorator, define  method need auth check.
     *
     * @Authorization
     */
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
}


/**
 * Authorization decorator, define class or method need auth check.
 *
 * @Authorization
 */
export const Authorization: IAuthorizationDecorator = createClassMethodDecorator<AuthorizationMetadata>('Authorization',
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
    ]) as IAuthorizationDecorator;



/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator {
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
     *
     * @Controller
     *
     * @param {ControllerMetadata} metadata  controller metadata.
     */
    (metadata: ControllerMetadata): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     *
     * @Controller
     */
    (target: Function): void;
}

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 */
export const Controller: IControllerDecorator =
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
    }, true) as IControllerDecorator;



/**
 * Cors Decorator, define controller class or controller method support cors request.
 * @Cors
 *
 * @export
 * @interface ICorsDecorator
 */
export interface ICorsDecorator {
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
     *
     * @Cors
     *
     * @param {CorsMetadata} [metadata] define metadata.
     */
    (metadata: CorsMetadata): ClassMethodDecorator;

    /**
     * Cors decorator, define all requset method of the controller support cors.
     *
     * @Cors
     */
    (target: Type): void;
    /**
     * Cors decorator, define method support cors.
     *
     * @Cors
     */
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
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
    metadataExtends?: MetadataExtends<T>): ICorsDecorator {
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
        ], metadataExtends) as ICorsDecorator

}

/**
 * Cors Decorator, define controller class or controller method support cors.
 * @Cors
 */
export const Cors: ICorsDecorator = createCorsDecorator<CorsMetadata>('Cors');


export type MiddlewareDecorator = <TFunction extends Type<IMiddleware>>(target: TFunction) => TFunction | void;

/**
 * Middleware decorator, define the class as mvc Middleware.
 * @Middleware
 *
 * @export
 * @interface IMiddlewareDecorator
 * @template T
 */
export interface IMiddlewareDecorator {
    /**
     * Middleware decorator, define the class as mvc Middleware.
     *
     * @Middleware
     *
     * @param {string} [name]  middleware name.
     */
    (name?: string): MiddlewareDecorator;
    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     *
     * @param {MiddlewareMetadata} middleware middleware name singed for mvc.
     */
    (middleware: MiddlewareMetadata): MiddlewareDecorator;

    /**
     * Middleware decorator. define the class as mvc Middleware.
     * @Middleware
     */
    (target: Type<IMiddleware>): void;
}

/**
 * Middleware Decorator, definde class as mvc middleware.
 *
 * @Middleware
 */
export const Middleware: IMiddlewareDecorator = createClassDecorator<MiddlewareMetadata>('Middleware',
    null,
    (metadata) => {
        metadata.singleton = true;
        if (metadata.name) {
            metadata.provide = metadata.name;
        }
        if (!metadata.scope) {
            metadata.scope = 'global';
        }
    }) as IMiddlewareDecorator;


/**
 * custom define Request method. route decorator type define.
 *
 * @export
 * @interface IRouteMethodDecorator
 */
export interface IRouteMethodDecorator {
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


    /**
     * route decorator. define the controller method as an route.
     *
     * @param {RouteMetadata} [metadata] route metadata.
     */
    (metadata: RouteMetadata): MethodDecorator;
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
    metaExtends?: MetadataExtends<T>) {
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
        });
}

/**
 * route decorator. define the controller method as an route.
 *
 * @Route
 */
export const Route: IRouteMethodDecorator = createRouteDecorator<RouteMetadata>() as IRouteMethodDecorator;



/**
 * Head decorator. define the route method as head.
 *
 * @Head
 *
 * @export
 * @interface IHeadDecorator
 */
export interface IHeadDecorator {
    /**
     * Head decorator. define the route method as head route.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Head decorator. define the route method as head route.
     *
     * @Head
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;

    /**
     * Head decorator. define the controller method as an route.
     *
     * @param {HeadMetadata} [metadata] head method metadata.
     */
    (metadata: HeadMetadata): MethodDecorator;
}


/**
 * Head decorator. define the route method as head.
 *
 * @Head
 */
export const Head: IHeadDecorator = createRouteDecorator<HeadMetadata>(RequestMethod.Head) as IHeadDecorator;


/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 *
 * @export
 * @interface IOptionsDecorator
 */
export interface IOptionsDecorator {
    /**
     * Options decorator. define the route method as an options route.
     *
     * @Options
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Options decorator. define the controller method as an options route.
     *
     * @param {OptionsMetadata} [metadata] options method metadata.
     */
    (metadata: OptionsMetadata): MethodDecorator;
}

/**
 * Options decorator. define the route method as an options.
 *
 * @Options
 */
export const Options: IOptionsDecorator = createRouteDecorator<OptionsMetadata>(RequestMethod.Options) as IOptionsDecorator;


/**
 * Get decorator. define the route method as get.
 *
 * @Get
 *
 * @export
 * @interface IGetDecorator
 */
export interface IGetDecorator {
    /**
     * Get decorator. define the route method as get route.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Get decorator. define the route method as get route.
     *
     * @Get
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;

    /**
     * Get decorator. define the controller method as an get route.
     *
     * @param {GetMetadata} [metadata] get method metadata.
     */
    (metadata: GetMetadata): MethodDecorator;
}

/**
 * Get decorator. define the route method as get.
 *
 * @Get
 */
export const Get: IGetDecorator = createRouteDecorator<GetMetadata>(RequestMethod.Get) as IGetDecorator;



/**
 * Delete decorator. define the route method as delete.
 *
 * @Delete
 *
 * @export
 * @interface IDeleteDecorator
 */
export interface IDeleteDecorator {
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


    /**
     * Delete decorator. define the controller method as an delete route.
     *
     * @param {DeleteMetadata} [metadata] delete method metadata.
     */
    (metadata: DeleteMetadata): MethodDecorator;

}
/**
 * Delete decorator. define the route method as delete.
 *
 * @Delete
 */
export const Delete: IDeleteDecorator = createRouteDecorator<DeleteMetadata>(RequestMethod.Delete) as IDeleteDecorator;



/**
 * Patch decorator. define the route method as an Patch.
 *
 * @Patch
 *
 * @export
 * @interface IPatchDecorator
 */
export interface IPatchDecorator {
    /**
     * Patch decorator. define the route method as an patch route.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Patch decorator. define the route method as patch route.
     *
     * @Patch
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;

    /**
     * Patch decorator. define the controller method as an patch route.
     *
     * @param {PatchMetadata} [metadata] patch method metadata.
     */
    (metadata: PatchMetadata): MethodDecorator;
}
/**
 * Patch decorator. define the route method as patch.
 *
 * @Patch
 */
export const Patch: IPatchDecorator = createRouteDecorator<PatchMetadata>(RequestMethod.Patch) as IPatchDecorator;




/**
 * Post decorator. define the route method as an Post.
 *
 * @Post
 *
 * @export
 * @interface IPostDecorator
 */
export interface IPostDecorator {
    /**
     * Post decorator. define the route method as an post route.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;
    /**
     * Post decorator. define the route method as post route.
     *
     * @Post
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
    /**
     * Post decorator. define the controller method as an post route.
     *
     * @param {PostMetadata} [metadata] post method metadata.
     */
    (metadata: PostMetadata): MethodDecorator;
}
/**
 * Post decorator. define the route method as post.
 *
 * @Post
 */
export const Post: IPostDecorator = createRouteDecorator<PostMetadata>(RequestMethod.Post) as IPostDecorator;



/**
 * Put decorator. define the route method as an Put.
 *
 * @Put
 *
 * @export
 * @interface IPutDecorator
 */
export interface IPutDecorator {
    /**
     * Put decorator. define the route method as an put route.
     *
     * @Put
     *
     * @param {string} route route sub path.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, contentType?: string): MethodDecorator;

    /**
     * Put decorator. define the route method as put route.
     *
     * @Put
     *
     * @param {string} route route sub path.
     * @param {MiddlewareType[]} middlewares the middlewares for the route.
     * @param {string} [contentType] set request contentType.
     */
    (route: string, middlewares: MiddlewareType[], contentType?: string): MethodDecorator;
    /**
     * Put decorator. define the controller method as an put route.
     *
     * @param {PutMetadata} [metadata] put method metadata.
     */
    (metadata: PutMetadata): MethodDecorator;
}
/**
 * Put decorator. define the route method as put.
 *
 * @Put
 */
export const Put: IPutDecorator = createRouteDecorator<PutMetadata>(RequestMethod.Put) as IPutDecorator;

