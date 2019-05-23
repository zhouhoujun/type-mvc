import { IRoute } from './IRoute';
import { IRouter } from './IRouter';
import { Token, Injectable, getTypeMetadata, isClass } from '@tsdi/ioc';
import { ControllerRoute } from './ControllerRoute';
import { Controller } from '../decorators';
import { ControllerMetadata } from '../metadata';



@Injectable
export class RouteBuilder {

    constructor() {

    }

    build(router: IRouter, ...controllers: Token<any>[]): IRoute {
        let root = router.getRoot();
        let contrkey = Controller.toString();
        controllers.forEach(ctrl => {
            if (isClass(ctrl)) {
                let ctrlmetadatas = getTypeMetadata<ControllerMetadata>(contrkey, ctrl);
                ctrlmetadatas.forEach(ctlmeta => {
                    if (!ctlmeta) {
                        return;
                    }
                    let prefix = ctlmeta.routePrefix;
                    if (prefix && !/^\//.test(prefix)) {
                        prefix = '/' + prefix;
                    }
                    let route = root.match(prefix);
                    let ctrlRoute = new ControllerRoute(prefix, ctrl);
                    if (route.isEmpty()) {
                        root.add(ctrlRoute);
                    } else {
                        route.add(ctrlRoute);
                    }
                });
            }
        });
        return root;
    }
}
