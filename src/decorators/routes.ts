import { makeDecorator, makePropDecorator } from './decorators';
import { RequestMethod } from '../util';


export interface RouteDecorator {
    route?: string;
    method?: RequestMethod;
}
export const Route: RouteDecorator = makeDecorator('Route', {
    route: undefined,
    method: undefined
});
