import { MvcContext } from './MvcContext';

import { IController, Get, AutoWired } from './decorators';
export abstract class ApiController implements IController {
    @AutoWired('MvcContext')
    context: MvcContext;
}
