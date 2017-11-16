import { makeDecorator, makeMethodDecorator } from './decorators';
import { RequestMethod } from '../util';

export interface GetDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): MethodDecorator;
}
export const Get: GetDecorator = makeMethodDecorator('Get', [['route', undefined], { method: RequestMethod.Get }]);



export interface PostDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Post: PostDecorator = makeMethodDecorator('Post', [['route', undefined], { method: RequestMethod.Post }]);



export interface PutDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Put: PutDecorator = makeMethodDecorator('Put', [['route', undefined], { method: RequestMethod.Put }]);



export interface DeleteDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Delete: DeleteDecorator = makeMethodDecorator('Delete', [['route', undefined], { method: RequestMethod.Delete }]);



export interface PatchDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Patch: PatchDecorator = makeMethodDecorator('Patch', [['route', undefined], { method: RequestMethod.Patch }]);



export interface HeadDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Head: HeadDecorator = makeMethodDecorator('Head', [['route', undefined], { method: RequestMethod.Head }]);



export interface OptionsDecorator {
    (route?: RegExp | string): MethodDecorator;
    new (route?: RegExp | string): any;
}
export const Options: OptionsDecorator = makeMethodDecorator('Options', [['route', undefined], { method: RequestMethod.Options }]);
