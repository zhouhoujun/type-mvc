import { TypeMetadata } from '@ts-ioc/core';
import { RequestMethod } from '../RequestMethod';
import { CorsOptions } from '../../IConfiguration';


export interface CorsMetadata extends TypeMetadata, CorsOptions {

}
