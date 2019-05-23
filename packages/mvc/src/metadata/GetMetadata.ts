import { MethodMetadata } from '@tsdi/ioc';


export interface GetMetadata extends MethodMetadata {
    route?: string;
}
