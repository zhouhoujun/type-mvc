import 'mocha';
import { expect } from 'chai';
import * as gulp from 'gulp';
import { Get, Post, Put, Delete, Patch, Head, Options, Controller, Authorization } from '../src';
import { AutoWired, Inject, Injectable } from 'type-autofac';
import { Middleware } from '../src/decorators';


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
