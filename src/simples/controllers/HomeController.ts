import { Controller, Get, IContext, symbols } from '../../index';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';

@Controller('/home')
export class HomeController {

    @Inject(symbols.IContext)
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
