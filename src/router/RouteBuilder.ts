import { IRoute } from './IRoute';
import { Token, Injectable } from 'type-autofac';

@Injectable
export class RouteBuilder {

    constructor() {

    }

    build(...controllers: Token<any>[]): IRoute[] {
        return [];
    }
}
