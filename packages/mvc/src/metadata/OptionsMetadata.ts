import { MethodMetadata } from '@tsdi/ioc';

export interface OptionsMetadata extends MethodMetadata {
    route?: string;
}
