import { Controller, Get, MvcContext, MvcContextName } from '../../index';
import { Inject } from 'type-autofac';


@Controller('/home')
export class HomeController {

    @Inject(MvcContextName)
    context: MvcContext;
    constructor() {

    }

    @Get('')
    index() {
        return 'hello'
    }
}
