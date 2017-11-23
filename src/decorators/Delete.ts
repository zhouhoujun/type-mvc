import { Router } from '../index';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { RequestMethod } from '../RequestMethod';
import { DeleteMetadata } from './metadata';



export const Delete: IRouteDecorator<DeleteMetadata> = createRouteDecorator<DeleteMetadata>('Delete', RequestMethod.Delete);
