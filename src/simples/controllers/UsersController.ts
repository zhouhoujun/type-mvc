import { Controller, Get, Post, IContext, symbols, Model, Field, Cors } from '../../index';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';
import { User } from '../models';
import { RequestMethod } from '../../RequestMethod';

@Cors
@Controller('/users')
export class UserController {

    // @Inject(symbols.IContext)
    // context: IContext;
    constructor(private work: Mywork) {

    }

    @Get('')
    index() {
        console.log('home index invorked', this.work);
        return this.work.workA();
    }

    @Cors([RequestMethod.Post])
    @Post('/add')
    async addUser(user: User, @Inject(symbols.IContext) ctx: IContext) {
        console.log('user:', user);
        console.log('request body', ctx.request['body']);
        return this.work.save(user);
    }

    @Get('/sub')
    sub() {
        return this.work.workB();
    }

    @Cors
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
