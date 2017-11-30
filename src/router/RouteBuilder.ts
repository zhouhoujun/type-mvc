import { IRoute } from './IRoute';
import { Token, Injectable, getTypeMetadata, isClass } from 'tsioc';
import { IRouter } from './Router';
import { Controller, ControllerMetadata } from '../decorators';
import { ControllerRoute } from './ControllerRoute';

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
                console.log('ctrlmetadatas', ctrlmetadatas);
                ctrlmetadatas.forEach(ctlmeta => {
                    if (!ctlmeta) {
                        return;
                    }
                    let prefix = ctlmeta.routePrefix;
                    let route = root.match(prefix);
                    let ctrlRoute = new ControllerRoute(prefix, ctrl);
                    if (route.isEmpty()) {
                        root.add(new ControllerRoute(prefix, ctrl));
                        console.log('add to root route', ctrlRoute);
                    } else {
                        route.add(new ControllerRoute(prefix, ctrl));
                        console.log('add to route', ctrlRoute);
                    }
                });
            }
        });
        return root;
    }
}
