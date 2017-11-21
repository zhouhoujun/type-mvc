
import { MethodMetadata } from 'type-autofac';
export interface PostMetadata extends MethodMetadata {
    route?: RegExp | string;
}
