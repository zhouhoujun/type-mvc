import { MethodMetadata } from '@tsdi/ioc';

export interface DeleteMetadata extends MethodMetadata {
    route?: string;
}
