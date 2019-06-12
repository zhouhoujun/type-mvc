import { Authenticator } from './Authenticator';
import { Abstract } from '@tsdi/ioc';
import { IConfiguration } from '@mvx/mvc';

@Abstract()
export abstract class PassportBuildService {
    abstract build(passport: Authenticator, configuration: IConfiguration): Promise<void>;
}
