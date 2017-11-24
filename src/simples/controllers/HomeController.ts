import { Controller, Get, IContext, ContextSymbol } from '../../index';
import { Inject } from 'type-autofac';


@Controller('/home')
export class HomeController {

    @Inject(ContextSymbol)
    context: IContext;
    constructor() {

    }

    @Get('')
    index() {
        return 'hello'
    }
}
