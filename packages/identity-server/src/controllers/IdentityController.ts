import { Controller, Get, Cors, Post, IContext, ContextToken } from '@mvx/mvc';
import { Inject } from '@tsdi/ioc';

@Cors
@Controller('/connect')
export class IdentityController {

    constructor() {

    }

    @Inject(ContextToken)
    ctx: IContext;

    @Get('/token')
    token() {
        return this.ctx.passport.serializeUser(this.ctx.user);
    }


    @Get('/userinfo')
    @Get('/profile')
    userinfo() {
        return this.ctx.passport.deserializeUser(this.ctx.session)
    }


    @Post('/:provider/authorize')
    authorize(provider: string) {
        return this.ctx.passport.authorize(provider);
    }

    @Get('/:provider/authenticate')
    authenticate(provider: string) {
        this.ctx.passport.authenticate(provider);
    }

    @Get('/endsession')
    endSession() {
        this.ctx.logout();
        this.ctx.redirect('/');
    }

    @Get('/:provider/callback')
    async callback(provider: string) {
        this.ctx.passport.authenticate(provider, {
            successRedirect: '/',
            failureRedirect: '/'
        })
    }
}
