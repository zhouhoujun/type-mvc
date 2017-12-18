import { Controller, Get, Post, IContext, symbols, BaseController, ViewResult, ResultValue } from '../../index';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';

@Controller('/')
export class HomeController extends BaseController {

    // @Inject(symbols.IContext)
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
