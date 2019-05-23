// import { IConfiguration } from './IConfiguration';
// import { Token, LoadType, isFunction, isToken } from '@tsdi/ioc';
// import { CustomMiddleware } from './middlewares';
// import { BootApplication } from '@tsdi/boot';
// import { ServerListenerToken } from './IListener';
// import { IApplication } from './IApplication';
// import { IMvcServer, IMvcHostBuilder, MvcServerToken } from './IMvcServer';

// /**
//  * load type or middleware.
//  */
// export type LoadTypeOrMiddleware = LoadType | CustomMiddleware;

// /**
//  * mvc applaction builder.
//  *
//  * @export
//  * @class AppBuilder
//  */
// export class MvcApplication extends BootApplication implements IMvcHostBuilder  {

//     middlewares: CustomMiddleware[];

//     /**
//      * create new application.
//      *
//      * @static
//      * @param {string} [rootdir]
//      * @returns
//      * @memberof WebApplication
//      */
//     static create(rootdir?: string): MvcApplication {
//         return new MvcApplication(rootdir);
//     }

//     use(...modules: LoadTypeOrMiddleware[]): this {
//         modules.forEach(m => {
//             if (isToken(m)) {
//                 super.use(m);
//             } else if (isFunction(m)) {
//                 this.middlewares.push(m);
//             } else {
//                 super.use(m);
//             }
//         })
//         return this;
//     }


//     useListener(listener: Function) {
//         this.provider(ServerListenerToken, () => listener);
//     }

//     /**
//      * bootstrap mvc application with App Module.
//      *
//      * @param {Token<any>} [app]
//      * @returns {Promise<T>}
//      * @memberof Bootstrap
//      */
//     async bootstrap(app?: Token<any> | IConfiguration): Promise<IApplication> {
//         let appType = app || MvcServerToken;
//         let instance = await super.bootstrap(appType) as IApplication;
//         return instance;
//     }

//     /**
//      * run application.
//      *
//      * @param {(Token<any> | IConfiguration)} [app]
//      * @returns {Promise<IApplication>}
//      * @memberof MvcContainer
//      */
//     run(app?: Token<any> | IConfiguration): Promise<IApplication> {
//         return this.bootstrap(app);
//     }

// }
