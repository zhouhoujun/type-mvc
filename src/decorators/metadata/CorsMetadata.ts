import { TypeMetadata } from 'tsioc';
import { RequestMethod } from '../../RequestMethod';
import { CorsOptions } from '../../Configuration';


export interface CorsMetadata extends TypeMetadata, CorsOptions {

}
