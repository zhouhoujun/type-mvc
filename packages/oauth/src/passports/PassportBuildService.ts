import { Authenticator } from './Authenticator';
import { Abstract } from '@tsdi/ioc';

@Abstract()
export abstract class PassportBuildService {
    abstract build(passport: Authenticator): Promise<void>;
}
