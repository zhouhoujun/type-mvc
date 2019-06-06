import { Strategy } from 'passport';
import { Abstract } from '@tsdi/ioc';

@Abstract()
export abstract class AuthStrategy extends Strategy {

}
