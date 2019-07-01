import { Controller, Get, Post, IContext, ContextToken,  RequestMethod, Cors, Authorization } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Mywork } from '../bi/Mywork';
import { User } from '../models';

@Cors
// @Authorization()
@Controller('/users')
export class UserController {

    // @Inject(ContextToken)
    // context: IContext;
    constructor(private work: Mywork) {

    }

    @Get('')
    index() {
        console.log('home index invorked', this.work);
        return this.work.workA();
    }

    @Authorization()
    // @Cors([RequestMethod.Post])
    @Post('/add')
    async addUser(user: User, @Inject(ContextToken) ctx: IContext) {
        console.log('user:', user);
        console.log('request body', ctx.request.body);
        return this.work.save(user);
    }

    @Get('/sub')
    sub() {
        return this.work.workB();
    }

    @Cors
    // @Authorization()
    @Get('/:name')
    getPerson(name: string) {
        return this.work.find(name);
    }

    @Get('/find/:name')
    find(@Inject(ContextToken) ctx, name: string) {
        console.log(ctx);
        return this.work.find(name);
    }

    // match request query param name.
    @Get('/query')
    query(key: string, role: string, age?: number){
        return { key: key, age: age, role: role}
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
