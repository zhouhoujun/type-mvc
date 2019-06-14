import { Type, LoadType } from '@tsdi/ioc';
import { LogModule } from '@tsdi/logs';
import { AopModule } from '@tsdi/aop';
import { BootApplication, checkBootArgs } from '@tsdi/boot';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';
import { ServerLogsModule } from '@tsdi/platform-server-logs';
import { MvcContext, MvcOptions, MvcContextToken } from './MvcContext';
import { MvcCoreModule } from './CoreModule';
import { MvcApp } from './MvcApp';
import { ComponentsModule } from '@tsdi/components';

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
    }

    getBootDeps() {
        let deps = super.getBootDeps();
        return [AopModule, LogModule, ServerBootstrapModule, ComponentsModule, ServerLogsModule, MvcCoreModule, ...deps];
    }

    /**
     * run mvc application.
     *
     * @static
     * @template T
     * @param {(T | Type<any> | MvcOptions)} [target]
     * @param {(LoadType[] | LoadType | string)} [deps]
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof MvcApplication
     */
    static async run<T extends MvcContext>(target?: T | Type<any> | MvcOptions, deps?: LoadType[] | LoadType | string, ...args: string[]): Promise<T> {
        let mdargs = checkBootArgs(deps, ...args);
        target = target || MvcApp;
        return await new MvcApplication(target, mdargs.deps).run(...mdargs.args) as T;
    }

    onContextInit(ctx: MvcContext) {
        super.onContextInit(ctx);
        this.container.bindProvider(MvcContextToken, ctx);
    }
}
