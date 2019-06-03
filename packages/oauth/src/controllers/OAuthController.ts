import { Controller, Get, Cors, Post } from '@mvx/mvc';

@Cors
@Controller('/connect')
export class OAuthController {


    @Get('/token')
    token() {

    }


    @Get('/userinfo')
    userinfo() {

    }


    @Post('/:provider')
    transport() {

    }

    authenticate() {

    }


    async callback() {

    }
}
