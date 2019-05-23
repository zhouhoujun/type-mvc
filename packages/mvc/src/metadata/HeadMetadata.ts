import { MethodMetadata } from '@tsdi/ioc';


export interface HeadMetadata extends MethodMetadata {
    route?: string;
}
