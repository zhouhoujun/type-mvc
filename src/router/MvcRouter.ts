import { Application } from '../Application';
import { Configuration } from '../Configuration';
import { Middleware, Router } from '../decorators';
import { RequestMethod } from '../RequestMethod';
import { IMiddleware } from '../middlewares';
import { ObjectMap, ActionComponent } from 'type-autofac';

@Middleware
@Router
export class MvcRouter implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {

    }

    routes(method: RequestMethod, express: string, action: Function) {

    }

    get(express: string, action: Function) {

    }

    setup() {

    }

}
