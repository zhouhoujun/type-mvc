import { Controller, Get, IContext, ContextSymbol } from '../../index';
import { Inject } from 'type-autofac';
import { Mywork } from '../bi/Mywork';

@Controller('/home')
export class HomeController {

    @Inject(ContextSymbol)
    context: IContext;
    constructor(private work: Mywork) {

    }

    @Get('')
    index() {
        return this.work.workA();
    }

    @Get('sub')
    sub() {
        return this.work.workB();
    }
}
