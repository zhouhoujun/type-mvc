import { Controller, Get, IContext, ContextName } from '../../index';
import { Inject } from 'type-autofac';


@Controller('/home')
export class HomeController {

    @Inject(ContextName)
    context: IContext;
    constructor() {

    }

    @Get('')
    index() {
        return 'hello'
    }
}
