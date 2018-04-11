import { MethodMetadata } from '@ts-ioc/core';


export interface GetMetadata extends MethodMetadata {
    route?: string;
}
