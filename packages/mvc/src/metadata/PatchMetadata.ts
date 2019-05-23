import { MethodMetadata } from '@tsdi/ioc';

export interface PatchMetadata extends MethodMetadata {
    route?: string;
}
