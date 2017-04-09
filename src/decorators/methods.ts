import { makeDecorator, makePropDecorator } from './decorators';
import { RequestMethod } from '../util';

export interface GetDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Get: GetDecorator = makePropDecorator('Get', [['route', undefined], { method: RequestMethod.Get }]);



export interface PostDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Post: PostDecorator = makePropDecorator('Post', [['route', undefined], { method: RequestMethod.Post }]);



export interface PutDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Put: PutDecorator = makePropDecorator('Put', [['route', undefined], { method: RequestMethod.Put }]);



export interface DeleteDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Delete: DeleteDecorator = makePropDecorator('Delete', [['route', undefined], { method: RequestMethod.Delete }]);



export interface PatchDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Patch: PatchDecorator = makePropDecorator('Patch', [['route', undefined], { method: RequestMethod.Patch }]);



export interface HeadDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Head: HeadDecorator = makePropDecorator('Head', [['route', undefined], { method: RequestMethod.Head }]);



export interface OptionsDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Options: OptionsDecorator = makePropDecorator('Options', [['route', undefined], { method: RequestMethod.Options }]);
