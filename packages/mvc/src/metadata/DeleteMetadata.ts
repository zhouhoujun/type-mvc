import { MethodMetadata } from '@ts-ioc/core';

export interface DeleteMetadata extends MethodMetadata {
    route?: string;
}
