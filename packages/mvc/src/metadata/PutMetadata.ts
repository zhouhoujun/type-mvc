import { MethodMetadata } from '@tsdi/ioc';

export interface PutMetadata extends MethodMetadata {
    route?: string;
}
