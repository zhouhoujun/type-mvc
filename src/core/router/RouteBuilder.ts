import { IRoute } from './IRoute';
import { Token, Injectable, getTypeMetadata, isClass, NonePointcut } from 'tsioc';
import { IRouter } from './Router';
import { Controller } from '../decorators/index';
import { ControllerRoute } from './ControllerRoute';
import { ControllerMetadata } from '../metadata/index';


@NonePointcut
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
                        root.add(new ControllerRoute(prefix, ctrl));
                    } else {
                        route.add(new ControllerRoute(prefix, ctrl));
                    }
                });
            }
        });
        return root;
    }
}
