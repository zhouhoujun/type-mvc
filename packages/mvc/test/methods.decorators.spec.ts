import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, MvcApplication, MvcApp, MvcModule, MvcServer } from '../src';
import { AutoWired, Inject, Injectable } from '@tsdi/ioc';
import { Suite, Before, Test, Assert, ExpectToken, Expect, After } from '@tsdi/unit';
import { MvcContext } from '../src/MvcContext';



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
    test2(@Inject(ExpectToken) expect: Expect) {
        expect(this.ctx.runnable instanceof MvcServer).toBeTruthy();
    }

    @After()
    destory() {
        this.ctx.runnable.stop();
    }

}


