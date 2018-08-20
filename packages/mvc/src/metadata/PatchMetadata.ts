import { MethodMetadata } from '@ts-ioc/core';

export interface PatchMetadata extends MethodMetadata {
    route?: string;
}
