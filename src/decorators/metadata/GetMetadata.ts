import { MethodMetadata } from 'tsioc';


export interface GetMetadata extends MethodMetadata {
    route?: RegExp | string;
}
