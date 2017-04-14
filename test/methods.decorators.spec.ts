import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import * as gulp from 'gulp';
import { Get, Post, Put, Delete, Patch, Head, Options, AutoWired, Controller } from '../src';

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

    @Delete('del/:id')
    delTest() {
        return {};
    }


}

describe('decorator', () => {

    it('get', () => {


    })
});
