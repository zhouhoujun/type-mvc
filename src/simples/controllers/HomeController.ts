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
        console.log('home index invorked', this.work);
        return this.work.workA();
    }

    @Get('/sub')
    sub() {
        return this.work.workB();
    }

    @Get('/test/:id')
    parmtest(id: number) {
        if (id === 1) {
            return this.work.workA();
        } else if (id === 2) {
            return this.work.workB();
        } else {
            return 'notFound';
        }
    }
}
