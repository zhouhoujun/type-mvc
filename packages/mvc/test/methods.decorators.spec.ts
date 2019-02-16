import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, IApplication, MvcHostBuilder, Application } from '../src';
import { AutoWired, Inject, Injectable } from '@ts-ioc/core';
import { Suite, Before, Test, Assert, ExpectToken, Expect, After } from '@ts-ioc/unit';
import { KoaModule } from '@mvx/koa'


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
    @Get('get/:id')
    getTest() {
        return {};
    }

    @Post('post/:id')
    postTest() {
        return {};
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

@Suite('constroller')
export class ControllerTest {

    private app: IApplication;
    @Before()
    async before() {
        this.app = await MvcHostBuilder.create()
            .use(KoaModule)
            .use(TestController)
            .bootstrap();
    }

    @Test('application has boot.')
    test1(@Inject(ExpectToken) expect: Expect) {
        expect(this.app instanceof Application).toBeTruthy();
        expect(this.app.getConfig().port).toEqual(3000);
    }

    @After()
    destory() {
        this.app.stop();
    }

}


