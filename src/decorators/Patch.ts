import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../RequestMethod';
import { IRouteDecorator, createRouteDecorator } from './Route';

export interface PatchMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Patch: IRouteDecorator<PatchMetadata> = createRouteDecorator<PatchMetadata>('Patch', RequestMethod.Patch);
