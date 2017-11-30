import { MethodMetadata } from 'tsioc';

export interface DeleteMetadata extends MethodMetadata {
    route?: RegExp | string;
}
