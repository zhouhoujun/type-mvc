import { Token, Injectable } from '@ts-ioc/core';
import { IRouter } from './IRouter';
import { IRoute } from './IRoute';
import { RouteBuilder } from './RouteBuilder';
import { RootRoute } from './RootRoute';


@Injectable
export class Router implements IRouter {

    private root: IRoute;

    constructor(private builder: RouteBuilder) {

    }

    setRoot(routePrefix = '') {
        this.root = new RootRoute(routePrefix);
    }

    getRoot(): IRoute {
        return this.root;
    }

    routes(map: IRoute) {
        this.root.add(map);
    }

    register(...controllers: Token<any>[]) {
        console.log(controllers);
        this.builder.build(this, ...controllers);
    }
}
