import { Controller, Get, Post, BaseController, ResultValue } from '@mvx/mvc';


@Controller('/')
export class HomeController extends BaseController {

    // @Inject(ContextToken)
    // context: IContext;
    constructor() {
        super();
    }

    @Get('')
    index(): ResultValue {
        return this.view('index.html');
    }

    @Get('/index2')
    home2(): ResultValue {
        return this.view('index2.html');
    }

    @Post('/goto/:pageName')
    gotoPage(date: Date, pageName: string): ResultValue {
        return this.redirect('/' + pageName);
    }
}
