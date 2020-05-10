import { Controller, Get, BaseController, ResultValue } from '@mvx/mvc';


@Controller('/')
export class HomeController extends BaseController {

    @Get('')
    index(): ResultValue {
        return this.view('index.html');
    }

}
