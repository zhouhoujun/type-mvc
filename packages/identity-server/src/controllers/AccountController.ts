import { Controller, Get, BaseController, ContextToken, IContext } from '@mvx/mvc';
import { UserSerive } from '../services/UserSerive';
import { Inject } from '@tsdi/ioc';

@Controller('/')
export class AccountController extends BaseController {

    constructor(private userService: UserSerive) {
        super();
    }

    @Get('')
    home() {
        return this.view('home');
    }

    @Get('/login')
    login() {
        return this.view('login');
    }


    @Get('/profile')
    userinfo(@Inject(ContextToken) ctx: IContext) {
        return this.view('profile', ctx.user);
    }

}
