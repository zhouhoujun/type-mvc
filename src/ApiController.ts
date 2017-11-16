import { MvcContext } from './MvcContext';
import { AutoWired, Registration } from 'type-autofac';
import { IController } from './IController';

export abstract class ApiController implements IController {
    @AutoWired('MvcContext')
    context: MvcContext;
}
