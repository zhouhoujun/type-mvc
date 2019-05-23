
import { MethodMetadata } from '@tsdi/ioc';
export interface PostMetadata extends MethodMetadata {
    route?: string;
}
