import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, MvcApplication, MvcApp, MvcModule, MvcServer, IContext, Cors, RequestMethod, ContextToken, MvcContext } from '../src';
import { AutoWired, Inject, Injectable } from '@tsdi/ioc';
import { Suite, Before, Test, Assert, ExpectToken, Expect, After } from '@tsdi/unit';
import expect = require('expect');
import axios from 'axios';
import { stringify } from 'querystring';

@Injectable
export class Car {

    constructor() {

    }
    put() {

    }
}

@Authorization()
@Controller('/api')
export class TestController {
    @Get('/:id')
    getTest(id: string) {
        return { id: id };
    }

    @Post('/')
    postTest(@Inject(ContextToken) ctx: IContext) {
        console.log(ctx.request.body);
        return ctx.request.body;
    }

    @Post('/cors')
    @Cors(RequestMethod.Post)
    corsPostTest(@Inject(ContextToken) ctx: IContext) {
        console.log(ctx.request.body);
        return ctx.request.body;
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
        // axios.defaults.withCredentials = true;
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
        let res = await axios.get(mvcserver.uri + '/api/test');
        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
        expect(res.data.id).toEqual('test');
    }

    @Test('application api post 200.')
    async test4() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        let res = await axios.post(mvcserver.uri + '/api', stringify({ test: 'post test', firstName: 'Fred',
        lastName: 'Flintstone' }));
        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
        expect(res.data.test).toEqual('post test')
    }

    @Test('application api post2 200.')
    async test5() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        let res = await axios.post(mvcserver.uri + '/api/cors', stringify({ test: 'post test' }));
        expect(res.data).toBeDefined();
        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
        expect(res.data.test).toEqual('post test')
    }

    // @Test('application api cors post 204.')
    // async test6() {
    //     let mvcserver = this.ctx.runnable as MvcServer;
    //     expect(mvcserver instanceof MvcServer).toBeTruthy();
    //     let res = await axios.post(mvcserver.uri + '/api', { test: 'post test' }, {
    //         headers: {
    //             Origin: 'http://192.168.0.10:3500'
    //         },
    //         // adapter: require('axios/lib/adapters/xhr')
    //     });
    //     expect(res.status).toEqual(204);
    // }

    @Test('application api cors post 200.')
    async test7() {
        let mvcserver = this.ctx.runnable as MvcServer;
        expect(mvcserver instanceof MvcServer).toBeTruthy();
        // let res = await axios({
        //     method: 'POST',
        //     headers: {
        //         Origin: 'http://127.0.0.1:3500'
        //         // 'Access-Control-Allow-Origin': '*',
        //         // 'Access-Control-Max-Age': 36000,
        //         // 'Access-Control-Allow-Credentials': true,
        //         // 'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
        //         // 'content-type': 'application/x-www-form-urlencoded'
        //     },
        //     data: stringify({ test: 'post test' }),
        //     url: mvcserver.uri + '/api/cors',
        //   });
        let res = await axios.post(mvcserver.uri + '/api/cors', { test: 'post test' }, {
            headers: {
                Origin: 'http://127.0.0.1:3500'
            }
        });
        expect(res.data).toBeDefined();
        expect(res.status).toEqual(200);
        expect(res.data).toBeDefined();
        expect(res.data.test).toEqual('post test')
    }

    @After()
    destory() {
        this.ctx.runnable.stop();
    }

}


