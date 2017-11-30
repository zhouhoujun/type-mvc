
import { MethodMetadata } from 'tsioc';

export interface PutMetadata extends MethodMetadata {
    route?: RegExp | string;
}
