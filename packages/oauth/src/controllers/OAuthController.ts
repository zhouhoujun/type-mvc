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
    transport(provider: string) {

    }

    @Post('/authorize')
    authorize() {

    }

    @Get('/authenticate')
    authenticate() {

    }

    @Get('/endsession')
    endSession() {

    }


    async callback() {

    }
}
