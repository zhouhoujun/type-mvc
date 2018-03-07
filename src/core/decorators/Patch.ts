import { RequestMethod } from '../RequestMethod';
import { IRouteDecorator, createRouteDecorator } from './Route';
import { PatchMetadata } from '../metadata/index';


export const Patch: IRouteDecorator<PatchMetadata> = createRouteDecorator<PatchMetadata>(RequestMethod.Patch);
