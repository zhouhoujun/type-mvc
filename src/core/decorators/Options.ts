import { RequestMethod } from '../RequestMethod';
import { createRouteDecorator, IRouteDecorator } from './Route';
import { OptionsMetadata } from '../metadata';


export const Options: IRouteDecorator<OptionsMetadata> = createRouteDecorator<OptionsMetadata>(RequestMethod.Options);
