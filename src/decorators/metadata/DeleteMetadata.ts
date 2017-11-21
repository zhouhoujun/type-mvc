import { MethodMetadata } from 'type-autofac';

export interface DeleteMetadata extends MethodMetadata {
    route?: RegExp | string;
}
