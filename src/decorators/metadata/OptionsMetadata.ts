import { MethodMetadata } from 'tsioc';
export interface OptionsMetadata extends MethodMetadata {
    route?: RegExp | string;
}
