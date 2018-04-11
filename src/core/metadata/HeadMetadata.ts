import { MethodMetadata } from '@ts-ioc/core';


export interface HeadMetadata extends MethodMetadata {
    route?: string;
}
