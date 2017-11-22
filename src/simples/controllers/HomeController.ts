import { Controller, Get } from '../../index';


@Controller('/home')
export class HomeController {

    constructor() {

    }

    @Get('')
    index() {
        return 
    }
}
