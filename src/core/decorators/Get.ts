import { createRouteDecorator, IRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';
import { GetMetadata } from '../metadata/index';



export const Get: IRouteDecorator<GetMetadata> = createRouteDecorator<GetMetadata>(RequestMethod.Get);

