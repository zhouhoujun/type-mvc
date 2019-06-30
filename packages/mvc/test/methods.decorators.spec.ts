import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, MvcApplication, MvcApp, MvcModule, MvcServer, IContext, Cors, RequestMethod } from '../src';
import { AutoWired, Inject, Injectable } from '@tsdi/ioc';
import { Suite, Before, Test, Assert, ExpectToken, Expect, After } from '@tsdi/unit';
import { MvcContext, MvcContextToken } from '../src/MvcContext';
import expect = require('expect');
import Axios from 'axios';

@Injectable
export class Car {

    constructor() {

    }
    put() {

    }
}

@Authorization
@Controller('/api')
export class TestController {
    @Get('/:id')
    getTest(id: string) {
        return { id: id };
    }

    @Post('/')
    postTest(@Inject(MvcContextToken) ctx: IContext) {
        console.log(ctx.body);
        return ctx.body;
    }

    @Post('/cors')
    @Cors(RequestMethod.Post)
    corsPostTest(@Inject(MvcContextToken) ctx: IContext) {
        console.log(ctx.body);
        return ctx.body
    }

    @Put('put/:id')
    putTest() {
        return {};
    }

    @Authorization
    @Delete('del/:id')
    delTest() {
        return {};
    }

    @AutoWired
    car: Car;


    get psersonal(): Car {
        return null;
    }


}

@MvcModule({
    imports: [
        TestController
    ]
})
class SimpleApp {

}

@Suite('constroller')
export class ControllerTest {

    private ctx: MvcContext;
    @Before()
    async before() {
        this.ctx = await MvcApplication.run(SimpleApp);
    }

    @Test('application has boot.')
    test1(@Inject(ExpectToken) expect: Expect) {
        expect(this.ctx instanceof MvcContext).toBeTruthy();
        expect(this.ctx.configuration.port).toEqual(3000);
    }


    @Test('application has instance mvc service.')
    test2() {
        expect(this.ctx.runnable instanceof MvcServer).toBeTruthy();
    }

    @Test('application api get.')
    async test3() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        let res = await Axios.get(mvcserver.uri + '/api/test');
        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
        expect(res.data.id).toEqual('test');
    }

    @Test('application api post 204.')
    async test4() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        let res = await Axios.post(mvcserver.uri + '/api', { test: 'post test' });
        expect(res.status).toEqual(204);
    }

    @Test('application api post cors 200.')
    async test5() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        let res = await Axios.post(mvcserver.uri + '/api/cors', { test: 'post test' });
        console.log(res);
        expect(res.status).toEqual(200);
    }

    @After()
    destory() {
        this.ctx.runnable.stop();
    }

}


