import { Type, LoadType } from '@tsdi/ioc';
import { LogModule } from '@tsdi/logs';
import { AopModule } from '@tsdi/aop';
import { BootApplication, checkBootArgs } from '@tsdi/boot';
import { MvcCoreModule } from './CoreModule';
import { MvcContext, MvcOptions, MvcContextToken } from './MvcContext';
import { MvcModule } from './MvcModule';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
export class MvcApplication extends BootApplication {

    async onInit(target: Type<any> | MvcOptions | MvcContext) {
        await super.onInit(target);

        // this.configMgr = bootOptions.configManager;
        // let gcfg = await this.configMgr.getConfig();
        // this.config = lang.assign(this.config || {}, gcfg, this.config);
        // this.container.bindProvider(ConfigurationToken, this.config);
        // this.getServer().init(this.config);
        // this.router = this.container.resolve(Router);
        // this.router.setRoot(this.config.routePrefix);

        // this.builder = bootOptions.bootBuilder as IMvcHostBuilder;

        // this.builder.getPools().iterator(c => {
        //     c.forEach((tk, fac) => {
        //         if (isClass(tk)) {
        //             if (hasOwnClassMetadata(Controller, tk)) {
        //                 this.controllers.push(tk);
        //                 this.container.bindProvider(tk, fac);
        //             } else if (hasOwnClassMetadata(Middleware, tk)) {
        //                 this.middlewares.push(tk);
        //                 this.container.bindProvider(tk, fac);
        //             }
        //         }
        //     })
        // });

        // this.router.register(...this.getControllers());

        // let midds: MiddlewareType[] = this.builder.middlewares || [];
        // midds = midds.concat(this.getMiddlewares() || []);
        // this.getMiddleChain()
        //     .use(...midds)
        //     .setup(this);

    }

    getBootDeps() {
        let deps = super.getBootDeps();
        return [AopModule, LogModule, MvcModule, ...deps];
    }

    static async run<T extends MvcContext>(target: T | Type<any> | MvcOptions, deps?: LoadType[] | LoadType | string, ...args: string[]): Promise<T> {
        let mdargs = checkBootArgs(deps, ...args);
        return await new MvcApplication(target, mdargs.deps).run(...mdargs.args) as T;
    }

    onContextInit(ctx: MvcContext) {
        super.onContextInit(ctx);
        this.container.bindProvider(MvcContextToken, ctx);
    }
}
