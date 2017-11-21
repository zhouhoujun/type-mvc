import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';

export interface OptionsMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Options: IRouteDecorator<OptionsMetadata> = createRouteDecorator<OptionsMetadata>('Options', RequestMethod.Options);
