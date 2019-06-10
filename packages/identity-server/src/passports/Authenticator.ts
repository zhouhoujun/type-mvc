import { Singleton, Abstract } from '@tsdi/ioc';
import { IContext } from '@mvx/mvc';
import { Middleware, Context } from 'koa';
import * as http from 'http';
import { AuthenticationError } from '../errors';
import { contextExtends } from './ContextExtends';
import { AuthState, AuthAction, FailAction, RedirectAction, PassAction, SuccessAction } from './AuthResult';

export interface AuthenticateOption {
    session?: boolean;
    successRedirect?: string;
    successReturnToOrRedirect?: string;
    failureRedirect?: string;
    assignProperty?: any;
    failureFlash?: string | { type: string, message: string };
    failureMessage?: string | boolean;
    failWithError?: boolean;
    successFlash?: string | { type: string, message: string };
    successMessage?: string | boolean;
    authInfo?: boolean;
}



declare module 'koa' {
    interface Context {
        passport: Authenticator;
        hasRole?(...role: string[]): boolean;
        login(user: any, options?: any): Promise<void>;
        logIn(user, options, done);
        logout(): void;
        logOut(): void;
        isAuthenticated(): boolean;
        isUnauthenticated(): boolean;
    }
}


/**
 * `Authenticator` constructor.
 *
 */

@Singleton()
export class Authenticator {
    private strategies: Map<string, Strategy>;
    private serializers;
    private deserializers;
    private infoTransformers: Array<(info, ctx: IContext) => Promise<any>>;
    private _userProperty = 'user';

    get userProperty() {
        return this._userProperty || 'user';
    }

    constructor() {
        this.strategies = new Map();
        this.serializers = [];
        this.deserializers = [];
        this.infoTransformers = [];
        this.use(new SessionStrategy());
    }

    /**
     * Utilize the given `strategy` with optional `name`, overridding the strategy's
     * default name.
     *
     * Examples:
     *
     *     passport.use(new TwitterStrategy(...));
     *
     *     passport.use('api', new http.BasicStrategy(...));
     *
     */
    public use(strategy: Strategy);
    public use(name: string, strategy: Strategy);
    public use(name: any, strategy?: Strategy) {
        if (strategy === undefined) {
            strategy = name;
            name = strategy.name;
        }
        if (!name) {
            throw new Error('Authentication strategies must have a name');
        }

        strategy.registerAuthenticator(this);
        this.strategies.set(name, strategy);

        return this;
    }

    /**
     * Un-utilize the `strategy` with given `name`.
     *
     * In typical applications, the necessary authentication strategies are static,
     * configured once and always available.  As such, there is often no need to
     * invoke this function.
     *
     * However, in certain situations, applications may need dynamically configure
     * and de-configure authentication strategies.  The `use()`/`unuse()`
     * combination satisfies these scenarios.
     *
     * Examples:
     *
     *     passport.unuse('legacy-api');
     *
     */
    public unuse(name: string) {
        this.strategies.delete(name);
        return this;
    }

    /**
     * Passport's primary initialization middleware.
     *
     * Intializes Passport for incoming requests, allowing
     * authentication strategies to be applied.
     *
     * If sessions are being utilized, applications must set up Passport with
     * functions to serialize a user into and out of a session.  For example, a
     * common pattern is to serialize just the user ID into the session (due to the
     * fact that it is desirable to store the minimum amount of data in a session).
     * When a subsequent request arrives for the session, the full User object can
     * be loaded from the database by ID.
     *
     * Note that additional middleware is required to persist login state, so we
     * must use the `connect.session()` middleware _before_ `passport.initialize()`.
     *
     * If sessions are being used, this middleware must be in use by the
     * Koa application for Passport to operate.  If the application is
     * entirely stateless (not using sessions), this middleware is not necessary,
     * but its use will not have any adverse impact.
     *
     * Options:
     *   - `userProperty`  Property to set on `ctx.state` upon login, defaults to _user_
     *
     * Examples:
     *     app.use(connect.cookieParser());
     *
     *     app.use(connect.session({ secret: 'keyboard cat' }));
     *     app.use(passport.initialize());
     *     app.use(passport.initialize({ userProperty: 'currentUser' }));
     *     app.use(passport.session());
     *
     *     passport.serializeUser(function(user, done) {
     *       done(null, user.id);
     *     });
     *
     *     passport.deserializeUser(function(id, done) {
     *       User.findById(id, function (err, user) {
     *         done(err, user);
     *       });
     *     });
     *
     */
    public initialize(userProperty?: string): Middleware {
        this._userProperty = userProperty || 'user';

        return async (ctx: Context, next) => {
            ctx.passport = this;
            const session = ctx.session;
            if (!session) {
                throw new Error('Session middleware is needed with passport middleware!');
                // ctx.app.use(sessionFactory());
            }
            if (!('passport' in session)) {
                ctx.session.passport = { user: undefined };
            }
            if (!('message' in session)) {
                session.message = {};
            }
            ctx.session = session;
            contextExtends(ctx);
            await next();
        };
    }

    /**
     * Authenticates requests.
     *
     * Applies the `name`ed strategy (or strategies) to the incoming request, in
     * order to authenticate the request.  If authentication is successful, the user
     * will be logged in and populated at `ctx.request.state.user` and a session will be
     * established by default. If authentication fails, an unauthorized response
     * will be sent.
     *
     * Options:
     *   - `session`          Save login state in session, defaults to _true_
     *   - `successRedirect`  After successful login, redirect to given URL
     *   - `failureRedirect`  After failed login, redirect to given URL
     *   - `assignProperty`   Assign the object provided by the verify callback to given property
     *
     * An optional `callback` can be supplied to allow the application to overrride
     * the default manner in which authentication attempts are handled.  The
     * callback has the following signature, where `user` will be set to the
     * authenticated user on a successful authentication attempt, or `false`
     * otherwise.  An optional `info` argument will be passed, containing additional
     * details provided by the strategy's verify callback.
     *
     *     app.get('/protected', function(ctx, next) {
     *       passport.authenticate('local', function(err, user, info) {
     *         if (err) { return next(err) }
     *         if (!user) { return ctx.redirect('/signin') }
     *         ctx.redirect('/account');
     *       })(ctx, next);
     *     });
     *
     * Note that if a callback is supplied, it becomes the application's
     * responsibility to log-in the user, establish a session, and otherwise perform
     * the desired operations.
     * Examples:
     *
     *     passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })(ctx);
     *
     *     passport.authenticate('local', function(err, user) {
     *       if (!user) { return ctx.redirect('/login'); }
     *       ctx.end('Authenticated!');
     *     })(ctx);
     *
     *     passport.authenticate('basic', { session: false })(ctx);
     *
     *     app.get('/auth/twitter', passport.authenticate('twitter'), function(ctx) {
     *       // request will be redirected to Twitter
     *     });
     */
    public authenticate(strategyNames: string | string[],
        callback?: (this: void, err: Error, user?, info?, status?) => void): Middleware;
    public authenticate(strategyNames: string | string[],
        options: AuthenticateOption,
        callback?: (this: void, err: Error, user?, info?, status?) => void): Middleware;
    public authenticate(strategyNames: string | string[],
        options: any = {},
        callback?: (this: void, err: Error, user?, info?, status?) => void): Middleware {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        let multi = true;
        // Cast `strategy` to an array, allowing authentication to pass through a chain of
        // strategies.  The first strategy to succeed, redirect, or error will halt
        // the chain.  Authentication failures will proceed through each strategy in
        // series, ultimately failing if all strategies fail.
        //
        // This is typically used on API endpoints to allow clients to authenticate
        // using their preferred choice of Basic, Digest, token-based schemes, etc.
        // It is not feasible to construct a chain of multiple strategies that involve
        // redirection (for example both Facebook and Twitter), since the first one to
        // redirect will halt the chain.
        if (typeof strategyNames === 'string') {
            strategyNames = [strategyNames];
            multi = false;
        }

        return async (ctx: Context, next) => {
            // if (http.IncomingMessage.prototype.logIn
            //     && http.IncomingMessage.prototype.logIn !== IncomingMessageExt.logIn) {
            //     require('../framework/connect').__monkeypatchNode();
            // }

            // accumulator for failures from each strategy in the chain
            const failures = [];

            function allFailed() {
                if (callback) {
                    if (!multi) {
                        return callback(null, false, failures[0].challenge, failures[0].status);
                    } else {
                        const challenges = failures.map(f => f.challenge);
                        const statuses = failures.map(f => f.status);
                        return callback(null, false, challenges, statuses);
                    }
                }

                // Strategies are ordered by priority.  For the purpose of flashing a
                // message, the first failure will be displayed.
                // const challenge = (failures[0] || {}).challenge || {};
                if (options.failureMessage && failures[0].challenge.type) {
                    const challenge = failures[0].challenge;
                    if (!(challenge.type in ctx.session.message)) {
                        ctx.session.message[challenge.type] = [];
                    }
                    ctx.session.message[challenge.type].push(challenge.messages);
                }
                if (options.failureRedirect) {
                    return ctx.redirect(options.failureRedirect);
                }

                // When failure handling is not delegated to the application, the default
                // is to respond with 401 Unauthorized.  Note that the WWW-Authenticate
                // header will be set according to the strategies in use (see
                // actions#fail).  If multiple strategies failed, each of their challenges
                // will be included in the response.

                const rchallenge = [];
                let rstatus;
                let status;
                for (const failure of failures) {
                    status = failure.status;
                    rstatus = rstatus || status;
                    if (typeof failure.challenge === 'string') {
                        rchallenge.push(failure.challenge);
                    }
                }

                ctx.status = rstatus || 401;
                if (ctx.status === 401 && rchallenge.length) {
                    ctx.set('WWW-Authenticate', rchallenge);
                }
                if (options.failWithError) {
                    throw new AuthenticationError(rstatus, http.STATUS_CODES[ctx.status]);
                }
                // console.log("==================");
                // console.log(http.STATUS_CODES[ctx.status]);
                // ctx.res.statusMessage = http.STATUS_CODES[ctx.status];
                ctx.response.message = http.STATUS_CODES[ctx.status];
                ctx.res.end(http.STATUS_CODES[ctx.status]);
            }

            for (const strategyName of strategyNames) {
                const strategy = this.strategies.get(strategyName);
                if (!strategy) {
                    throw new Error(`Unknown authentication strategy "${strategyName}"`);
                }
                try {
                    const res = await strategy.authenticate(ctx, options);
                    switch (res.type) {
                        case AuthState.FAIL: {
                            const { challenge, status } = (res as FailAction);
                            // push this failure into the accumulator and attempt authentication
                            // using the next strategy
                            failures.push({ challenge, status });
                            break;
                        }
                        case AuthState.REDIRECT: {
                            const { url, status } = (res as RedirectAction);
                            ctx.status = status;
                            ctx.redirect(url);
                            return;
                        }
                        case AuthState.SUCCESS: {
                            const { user, info } = (res as SuccessAction);
                            if (callback) {
                                return callback(null, user, info);
                            }

                            if (options.successMessage) {
                                if (!(info.type in ctx.session.message)) {
                                    ctx.session.message[info.type] = [];
                                }
                                ctx.session.message[info.type].push(info.message);
                            }
                            if (options.assignProperty) {
                                ctx.state[options.assignProperty] = user;
                                return next();
                            }

                            await ctx.login(user);
                            if (options.authInfo !== false) {
                                ctx.state.authInfo = await this.transformAuthInfo(info, ctx);
                            }
                            if (options.successReturnToOrRedirect) {
                                let url = options.successReturnToOrRedirect;
                                if (ctx.session && ctx.session.returnTo) {
                                    url = ctx.session.returnTo;
                                    delete ctx.session.returnTo;
                                }
                                return ctx.redirect(url);
                            }
                            if (options.successRedirect) {
                                return ctx.redirect(options.successRedirect);
                            }
                            return await next();
                        }
                        case AuthState.PASS:
                        default: {
                            return await next();
                        }
                    }
                } catch (error) {
                    if (callback) {
                        return callback(error);
                    }
                    throw error;
                }
            }
            return allFailed();
        };
    }

    /**
     * Middleware that will authorize a third-party account using the given
     * `strategy` name, with optional `options`.
     *
     * If authorization is successful, the result provided by the strategy's verify
     * callback will be assigned to `ctx.state.account`.  The existing login session and
     * `ctx.state.user` will be unaffected.
     *
     * This function is particularly useful when connecting third-party accounts
     * to the local account of a user that is currently authenticated.
     *
     * Examples:
     *
     *    passport.authorize('twitter-authz', { failureRedirect: '/account' });
     */
    public authorize(strategy: string | string[], options: AuthenticateOption = {}, callback?) {
        options.assignProperty = 'account';
        return this.authenticate(strategy, options, callback);
    }

    /**
     * Middleware that will restore login state from a session.
     *
     * Web applications typically use sessions to maintain login state between
     * requests.  For example, a user will authenticate by entering credentials into
     * a form which is submitted to the server.  If the credentials are valid, a
     * login session is established by setting a cookie containing a session
     * identifier in the user's web browser.  The web browser will send this cookie
     * in subsequent requests to the server, allowing a session to be maintained.
     *
     * If sessions are being utilized, and a login session has been established,
     * this middleware will populate `req.user` with the current user.
     *
     * Note that sessions are not strictly required for Passport to operate.
     * However, as a general rule, most web applications will make use of sessions.
     * An exception to this rule would be an API server, which expects each HTTP
     * request to provide credentials in an Authorization header.
     *
     * Examples:
     *
     *     app.use(connect.cookieParser());
     *     app.use(connect.session({ secret: 'keyboard cat' }));
     *     app.use(passport.initialize());
     *     app.use(passport.session());
     *
     * Options:
     *   - `pauseStream`      Pause the request stream before deserializing the user
     *                        object from the session.  Defaults to _false_.  Should
     *                        be set to true in cases where middleware consuming the
     *                        request body is configured after passport and the
     *                        deserializeUser method is asynchronous.
     *
     * @api public
     */
    public session(options?: AuthenticateOption): Middleware {
        return this.authenticate('session', options);
    }

    /**
     * Registers a function used to serialize user objects into the session.
     *
     * Examples:
     *
     *     passport.serializeUser(function(user, done) {
     *       done(null, user.id);
     *     });
     *
     * @api public
     */
    public serializeUser(fn: (user: any, ctx: Context) => Promise<any>);
    public async serializeUser(user: object, ctx: Context);
    public async serializeUser(user, ctx?) {
        if (typeof user === 'function') {
            return this.serializers.push(user);
        }

        for (const layer of this.serializers) {
            const obj = await layer(user, ctx);
            if (obj || obj === 0) {
                return obj;
            }
        }
        throw new Error('Failed to serialize user into session');
    }

    /**
     * Registers a function used to deserialize user objects out of the session.
     *
     * Examples:
     *
     *     passport.deserializeUser(function(id, done) {
     *       User.findById(id, function (err, user) {
     *         done(err, user);
     *       });
     *     });
     *
     * @api public
     */
    public deserializeUser(fn: (obj: any, ctx: Context) => Promise<any>);
    public async deserializeUser(obj: any, ctx: Context);
    public async deserializeUser(obj, ctx?) {
        if (typeof obj === 'function') {
            return this.deserializers.push(obj);
        }

        for (const layer of this.deserializers) {
            const user = await layer(obj, ctx);
            if (user) {
                return user;
            } else if (user === null || user === false) {
                return false;
            }
        }
        throw new Error('Failed to deserialize user out of session');
    }

    /**
     * Registers a function used to transform auth info.
     *
     * In some circumstances authorization details are contained in authentication
     * credentials or loaded as part of verification.
     *
     * For example, when using bearer tokens for API authentication, the tokens may
     * encode (either directly or indirectly in a database), details such as scope
     * of access or the client to which the token was issued.
     *
     * Such authorization details should be enforced separately from authentication.
     * Because Passport deals only with the latter, this is the responsiblity of
     * middleware or routes further along the chain.  However, it is not optimal to
     * decode the same data or execute the same database query later.  To avoid
     * this, Passport accepts optional `info` along with the authenticated `user`
     * in a strategy's `success()` action.  This info is set at `req.authInfo`,
     * where said later middlware or routes can access it.
     *
     * Optionally, applications can register transforms to proccess this info,
     * which take effect prior to `req.authInfo` being set.  This is useful, for
     * example, when the info contains a client ID.  The transform can load the
     * client from the database and include the instance in the transformed info,
     * allowing the full set of client properties to be convieniently accessed.
     *
     * If no transforms are registered, `info` supplied by the strategy will be left
     * unmodified.
     *
     * Examples:
     *
     *     passport.transformAuthInfo(function(info, done) {
     *       Client.findById(info.clientID, function (err, client) {
     *         info.client = client;
     *         done(err, info);
     *       });
     *     });
     *
     * @api public
     */
    public transformAuthInfo(fn: (info, ctx: Context) => Promise<any>): void;
    public transformAuthInfo(info: { type: string, message: string }, ctx: Context);
    public async transformAuthInfo(info, ctx?) {
        if (typeof info === 'function') {
            return this.infoTransformers.push(info);
        }

        // private implementation that traverses the chain of transformers,
        // attempting to transform auth info

        for (const layer of this.infoTransformers) {
            const tinfo = await layer(info, ctx);
            if (tinfo) {
                return tinfo;
            }
        }
        return info;
    }
}



@Abstract()
export abstract class Strategy {
    name: string;
    protected authenticator: Authenticator;

    public abstract authenticate(ctx: Context, options?: any): Promise<AuthAction>;

    public registerAuthenticator(authenticator: Authenticator) {
        this.authenticator = authenticator;
    }
}


// @Injectable(Strategy, 'session')
export class SessionStrategy extends Strategy {
    /**
     * `SessionStrategy` constructor.
     *
     */
    constructor() {
        super();
        this.name = 'session';
    }

    /**
     * Authenticate request based on the current session state.
     *
     * The session authentication strategy uses the session to restore any login
     * state across requests.  If a login session has been established, `req.user`
     * will be populated with the current user.
     *
     * This strategy is registered automatically by Passport.
     *
     */
    public async authenticate(ctx: IContext, options = {}): Promise<AuthAction> {
        if (!ctx.passport) {
            throw new Error('passport.initialize() middleware not in use');
        }

        let su;
        if (ctx.session.passport) {
            su = ctx.session.passport.user;
        }

        if (su || su === 0) {
            // NOTE: Stream pausing is desirable in the case where later middleware is
            //       listening for events emitted from request.  For discussion on the
            //       matter, refer to: https://github.com/jaredhanson/passport/pull/106
            const user = ctx.passport.deserializeUser(su, ctx);
            if (!user) {
                ctx.session.passport.user = undefined;
                return new PassAction();
            }
            const property = ctx.passport.userProperty;
            ctx[property] = user;
        }
        return new PassAction();
    }
}
