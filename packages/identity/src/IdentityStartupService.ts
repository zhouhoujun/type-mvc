import { Injectable } from '@tsdi/ioc';
import { BeforeMidddlewareStartupService, MvcMiddlewares, MvcContext } from '@mvx/mvc';
import { PassportBuildService, ConfigurePassportBuildService, AuthenticatorToken } from './passports';

@Injectable
export class IdentityStartupService extends BeforeMidddlewareStartupService {

    async startup(ctx: MvcContext, middlewares?: MvcMiddlewares): Promise<void> {
        let passport = ctx.getContainer().resolve(AuthenticatorToken);
        let services = ctx.getContainer().getServices(PassportBuildService);
        // config build first.
        let cfs = services.find(s => s instanceof ConfigurePassportBuildService);
        if (cfs && services.indexOf(cfs) > 0) {
            services.splice(services.indexOf(cfs), 1);
            services.unshift(cfs);
        }
        await Promise.all(services.map(s => s.build(passport, ctx.configuration)));
    }

}
