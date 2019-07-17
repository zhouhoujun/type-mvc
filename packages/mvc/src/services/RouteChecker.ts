import { IocCoreService, Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';

@Singleton
export class RouteChecker extends IocCoreService {

    private assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;

    isRoute(ctxUrl: string): boolean {
        return !this.assertUrlRegExp.test(ctxUrl);
    }

    getReqRoute(ctx: IContext): string {
        let reqUrl = this.vaildify(ctx.url, true);
        if (ctx.mvcContext.configuration.routePrefix) {
            return reqUrl.replace(ctx.mvcContext.configuration.routePrefix, '');
        }
        return reqUrl;
    }


    vaildify(routePath: string, foreNull = false): string {
        if (foreNull && routePath === '/') {
            routePath = '';
        }
        if (/\/\s*$/.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('/'));
        }
        if (/\?\S*$/.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('?'));
        }
        return routePath;
    }

    isActiveRoute(ctx: IContext, route: string) {
        let routeUrl = this.getReqRoute(ctx);
        if (route === '') {
            return true;
        }
        return routeUrl.startsWith(route);
    }
}
