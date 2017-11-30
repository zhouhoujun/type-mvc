
import { MethodMetadata } from 'tsioc';
export interface PostMetadata extends MethodMetadata {
    route?: RegExp | string;
}
