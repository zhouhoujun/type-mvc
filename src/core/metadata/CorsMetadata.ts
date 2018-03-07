import { TypeMetadata } from 'tsioc';
import { RequestMethod } from '../RequestMethod';
import { CorsOptions } from '../../IConfiguration';


export interface CorsMetadata extends TypeMetadata, CorsOptions {

}
