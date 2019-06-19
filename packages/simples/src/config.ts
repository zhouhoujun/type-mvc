import { IConfiguration } from '@mvx/mvc';

const port = 3000;
const oauthProviderId = 'markus';

export default {

    // debug: true
    passports: {
        strategies: [
            {
                strategy: 'oidc',
                scope: '',
                isLiberty: true,
                issuer: 'http://localhost:' + port,
                clientID: 'markus01',
                clientSecret: 'markus01',
                authorizationURL: 'http://localhost:' + port + '/oidc/endpoint/' + oauthProviderId + '/authorize',
                tokenURL: 'http://localhost:' + port + '/token',
                callbackURL: 'http://localhost:3000/callback',
                userInfoURL: 'http://localhost:' + port + '/me'
            }
        ]
    }
} as IConfiguration;
