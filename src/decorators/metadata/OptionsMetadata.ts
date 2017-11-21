import { MethodMetadata } from 'type-autofac';
export interface OptionsMetadata extends MethodMetadata {
    route?: RegExp | string;
}
