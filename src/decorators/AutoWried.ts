import { makePropDecorator } from './decorators';
import { RequestMethod, Type } from '../util';


export interface AutoWiredDecorator {
    (type?: string): PropertyDecorator;
    new (type?: string): any;
}
export const AutoWired: AutoWiredDecorator = makePropDecorator('AutoWired', [['type', undefined]]);
