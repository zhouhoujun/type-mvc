import { makePropDecorator } from './decorators';


export interface AutoWiredDecorator {
    (type?: string): PropertyDecorator;
    new (type?: string): any;
}
export const AutoWired: AutoWiredDecorator = makePropDecorator('AutoWired', [['type', undefined]]);
