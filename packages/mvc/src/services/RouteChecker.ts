import { IocCoreService, Singleton } from '@tsdi/ioc';
import { IContext } from '../IContext';

const urlReg = /\/((\w|%|\.))+\.\w+$/;
const noParms = /\/\s*$/;
const hasParms = /\?\S*$/;
const subStart = /^\s*\/|\?/;

@Singleton()
export class RouteChecker extends IocCoreService {

    private assertUrlRegExp = urlReg;

    isRoute(ctxUrl: string): boolean {
        return !this.assertUrlRegExp.test(ctxUrl);
    }

    getReqRoute(ctx: IContext): string {
        let reqUrl = this.vaildify(ctx.url, true);
        let config = ctx.mvcContext.getConfiguration();
        if (config.routePrefix) {
            return reqUrl.replace(config.routePrefix, '');
        }
        return reqUrl;
    }


    vaildify(routePath: string, foreNull = false): string {
        if (foreNull && routePath === '/') {
            routePath = '';
        }
        if (noParms.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('/'));
        }
        if (hasParms.test(routePath)) {
            routePath = routePath.substring(0, routePath.lastIndexOf('?'));
        }
        return routePath;
    }

    isActiveRoute(ctx: IContext, route: string) {
        let routeUrl = this.getReqRoute(ctx);
        if (route === '' || route === routeUrl) {
            return true;
        }
        return routeUrl.startsWith(route) && subStart.test(routeUrl.substring(route.length));
    }
}
