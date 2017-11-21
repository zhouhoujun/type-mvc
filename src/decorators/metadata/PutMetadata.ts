
import { MethodMetadata } from 'type-autofac';

export interface PutMetadata extends MethodMetadata {
    route?: RegExp | string;
}
