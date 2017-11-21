import { MethodMetadata } from 'type-autofac';

export interface PatchMetadata extends MethodMetadata {
    route?: RegExp | string;
}
