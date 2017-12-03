import { Controller, Get, Post, IContext, symbols } from '../../index';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';

@Controller('/users')
export class UserController {

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

    @Get('/:name')
    getPerson(name: string) {
        return this.work.find(name);
    }

    @Get('/find/:name')
    query(name: string, @Inject(symbols.IContext) ctx) {
        console.log(ctx);
        return this.work.find(name);
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

    @Post('/posttest/:id')
    postTest(id: number) {
        return {
            id: id
        }
    }

}
