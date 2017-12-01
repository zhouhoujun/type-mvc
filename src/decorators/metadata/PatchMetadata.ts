import { MethodMetadata } from 'tsioc';

export interface PatchMetadata extends MethodMetadata {
    route?: string;
}
