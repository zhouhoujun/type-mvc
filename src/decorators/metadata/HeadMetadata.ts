import { MethodMetadata } from 'tsioc';


export interface HeadMetadata extends MethodMetadata {
    route?: string;
}
