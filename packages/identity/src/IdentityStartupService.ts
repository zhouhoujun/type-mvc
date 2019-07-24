import { BeforeMidddlewareStartupService, MvcMiddlewares, MvcContext } from '@mvx/mvc';
import { Injectable } from '@tsdi/ioc';
import { PassportBuildService, ConfigurePassportBuildService, Authenticator } from './passports';

@Injectable
export class IdentityStartupService extends BeforeMidddlewareStartupService {

    async startup(ctx: MvcContext, middlewares?: MvcMiddlewares): Promise<void> {
        let passport = ctx.getRaiseContainer().resolve(Authenticator);
        let services = ctx.getRaiseContainer().getServices(PassportBuildService);
        // config build first.
        let cfs = services.find(s => s instanceof ConfigurePassportBuildService);
        if (cfs && services.indexOf(cfs) > 0) {
            services.splice(services.indexOf(cfs), 1);
            services.unshift(cfs);
        }
        await Promise.all(services.map(s => s.build(passport, ctx.configuration)));
    }

}
