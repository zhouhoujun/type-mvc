import {
    Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, MvcApplication, MvcApp,
    MvcModule, MvcServer, IContext, Cors, RequestMethod, ContextToken, MvcContext, IConfiguration
} from '@mvx/mvc';
import { AutoWired, Inject, Injectable } from '@tsdi/ioc';
import { Suite, Before, Test, Assert, ExpectToken, Expect, After } from '@tsdi/unit';
import expect = require('expect');
import axios from 'axios';
import { Authenticator, IdentityModule, LocalStrategy } from '../src';
import { ComponentBuilder } from '@tsdi/components';


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

@Cors
@Controller('/api2')
export class Test2Controller {

    @Authorization()
    @Get('/:id')
    getEl(id: string) {
        return { id: id };
    }

}

@MvcModule({
    port: 3010,
    imports: [
        IdentityModule
    ],
    controllers: [
        TestController,
        Test2Controller
    ],
    passports: {
        default: { strategy: 'local' },
        strategies: [
            {
                strategy: 'local',
                usernameField: 'user',
                passwordField: 'passwd',
                verify: (username: string, password: string, ctx: IContext) => {
                    console.log('local-verify', username, password);
                    return { user: {id: 'user', name: 'test' } };
                }
            }
        ],
        serializers: [
            async (user: any, ctx: IContext) => {
                return user.id;
            }
        ],
        deserializers: [
            (obj: any, ctx?: IContext) => {
                return { id: obj } as any;
            }
        ]
    },
    exports: [
        IdentityModule
    ]
})
class SimpleApp {

}

@Suite('constroller')
export class LocalStrategyTest {

    private ctx: MvcContext;
    @Before()
    async before() {
        // axios.defaults.withCredentials = true;
        this.ctx = await MvcApplication.run(SimpleApp);
    }

    @Test()
    async canGetApi1() {
        let val = await axios.get('http://localhost:3010/api/test1')
        expect(val.data).toEqual({ id: 'test1' });
    }


    @Test('loacl has stup.')
    test1() {
        let auth = this.ctx.injector.resolve(Authenticator);
        console.log(auth['strategies'])
        expect(auth.get('local')).toBeTruthy();
    }


    @Test('resolve strategy.')
    async test2() {
        let loacl = await this.ctx.injector.resolve(ComponentBuilder)
            .resolveTemplate({
                template: {
                    // element: 'local',
                    strategy: 'local',
                    username: 'user',
                    passwd: 'passwd'
                }
            });

        // console.log(loacl);
        expect(loacl instanceof LocalStrategy).toBeTruthy();

    }


    @Test()
    async canGetApi2() {

        let val = await axios.get('http://localhost:3010/api2/test2');
        expect(val.data).toEqual({ id: 'test2' });

    }


    @After()
    destory() {
        this.ctx.destroy();
    }

}


