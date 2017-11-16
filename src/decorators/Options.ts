import { createMethodDecorator, IMethodDecorator, MethodMetadata } from 'type-autofac';
import { RequestMethod } from '../util';

export interface OptionsMetadata extends MethodMetadata {
    route?: RegExp | string;
}

export const Options: IMethodDecorator = createMethodDecorator<OptionsMetadata>('Options');
