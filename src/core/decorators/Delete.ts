import { Router } from '../router';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';
import { DeleteMetadata } from '../metadata/index';



export const Delete: IRouteDecorator<DeleteMetadata> = createRouteDecorator<DeleteMetadata>(RequestMethod.Delete);
