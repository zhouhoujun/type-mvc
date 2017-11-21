import { MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';

export interface HeadMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Head: IRouteDecorator<HeadMetadata> = createRouteDecorator<HeadMetadata>('Head', RequestMethod.Head);
