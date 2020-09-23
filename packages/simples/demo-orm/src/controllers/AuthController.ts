import { Inject } from '@tsdi/ioc';
import { Controller, Post, ContextToken, IContext, Cors, Get, Authorization } from '@mvx/mvc';
import { JwtStrategy, IAuthenticator } from '@mvx/identity';
import { ResponseResult } from '../ResponseResult';
import { UserRepository } from '../repositories/UserRepository';


@Cors()
@Controller('/auth')
export class AuthController {

    @Inject(ContextToken)
    private ctx: IContext;
    @Inject()
    private rep: UserRepository;

    constructor() {

    }


    @Post('/login')
    async login() {
        let body = this.ctx.request.body;
        let { user, info } = await this.rep.verify(body.username, body.password);
        if (user) {
            let strategy = this.ctx.passport.get('jwt') as JwtStrategy;
            let sign = await strategy.sign({
                data: user.id.toString()
            }, strategy.secretOrKey, { expiresIn: 60 * 60 * 1000 });
            return ResponseResult.success(sign);
        } else {
            return this.ctx.throw(401, info);
        }
    }

    @Authorization()
    @Get('/refresh')
    async refreshToken() {
        let strategy = this.ctx.passport.get('jwt') as JwtStrategy;
        let sign = await strategy.sign({
            data: this.ctx.getUser().id
        }, strategy.secretOrKey, { expiresIn: 60 * 60 * 1000 });
        return ResponseResult.success(sign);

    }

    @Authorization()
    @Get('/profile')
    profile() {
        return ResponseResult.success(this.ctx.getUser());
    }

    @Get('/logout')
    logout() {
        this.ctx.logout();
        return ResponseResult.success();
    }

}
