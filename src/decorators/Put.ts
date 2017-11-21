import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { PutMetadata } from './metadata';


export const Put: IRouteDecorator<PutMetadata> = createRouteDecorator<PutMetadata>('Put', RequestMethod.Put);

