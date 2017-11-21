import { MethodMetadata } from 'type-autofac';


export interface HeadMetadata extends MethodMetadata {
    route?: RegExp | string;
}
