import { Injectable, Singleton } from '@tsdi/ioc';
import { BeforeMidddlewareStartupService, MvcMiddlewares, MvcContext } from '@mvx/mvc';
import { PassportBuildService, ConfigurePassportBuildService, AuthenticatorToken } from './passports';

@Singleton
export class IdentityStartupService extends BeforeMidddlewareStartupService {

    async startup(ctx: MvcContext, middlewares?: MvcMiddlewares): Promise<void> {
        let passport = ctx.injector.get(AuthenticatorToken);
        let services = ctx.injector.getServices(PassportBuildService);
        // config build first.
        let cfs = services.find(s => s instanceof ConfigurePassportBuildService);
        if (cfs && services.indexOf(cfs) > 0) {
            services.splice(services.indexOf(cfs), 1);
            services.unshift(cfs);
        }
        await Promise.all(services.map(s => s.build(passport, ctx.getConfiguration())));
    }

}
