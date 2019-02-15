import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization, Middleware } from '../src';
import { AutoWired, Inject, Injectable } from '@ts-ioc/core';


@Injectable
export class Car {

    constructor() {

    }
    put() {

    }
}

@Authorization
@Controller('/api')
export class TestRequest {
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



describe('decorator', () => {

    before(() => {

    })

    it('get', () => {

    })
});
