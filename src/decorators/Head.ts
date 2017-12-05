import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { HeadMetadata } from './metadata';

export const Head: IRouteDecorator<HeadMetadata> = createRouteDecorator<HeadMetadata>(RequestMethod.Head);
