import { Controller, Get, Cors, Post, IContext, ContextToken } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';
import { Authenticator } from '../passports';

@Cors
@Controller('/connect')
export class OAuthController {

    @Inject()
    passport: Authenticator;

    @Get('/token')
    token() {
        this.passport.authorize('')
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

    @Get('/:provider/authenticate')
    authenticate(provider: string) {
        this.passport.authenticate(provider);
    }

    @Get('/endsession')
    endSession(@Inject(ContextToken) ctx: IContext) {
        ctx.logout();
        ctx.redirect('/');
    }

    @Get('/:provider/callback')
    async callback(provider: string) {
        this.passport.authenticate(provider, {
            successRedirect: '/',
            failureRedirect: '/'
        })
    }
}
