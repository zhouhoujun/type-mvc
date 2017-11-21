import { MethodMetadata } from 'type-autofac';


export interface GetMetadata extends MethodMetadata {
    route?: RegExp | string;
}
