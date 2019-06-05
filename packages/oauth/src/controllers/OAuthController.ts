import { Controller, Get, Cors, Post } from '@mvx/mvc';
import { MvcPassport } from '../passports';
import { Inject } from '@tsdi/ioc';

@Cors
@Controller('/connect')
export class OAuthController {

    @Inject()
    passport: MvcPassport;

    @Get('/token')
    token() {

    }


    @Get('/userinfo')
    @Get('/profile')
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
