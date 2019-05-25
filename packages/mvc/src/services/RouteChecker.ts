import { IocCoreService, Singleton } from '@tsdi/ioc';

@Singleton
export class RouteChecker extends IocCoreService {

    private assertUrlRegExp = /\/((\w|%|\.))+\.\w+$/;

    isRoute(ctxUrl: string): boolean {
        return !this.assertUrlRegExp.test(ctxUrl);
    }
}
