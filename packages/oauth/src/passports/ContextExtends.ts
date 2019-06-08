import { BaseContext, Context } from 'koa';



declare module 'koa' {
    interface Context {
        login(user: any, options?: any): Promise<void>;
        logIn(user, options, done);
        logout(): void;
        logOut(): void;
        isAuthenticated(): boolean;
        isUnauthenticated(): boolean;
    }
}


/**
 * Intiate a login session for `user`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to `true`
 *
 * Examples:
 *
 *     await req.logIn(user, { session: false });
 *
 * @api public
 */
async function login(this: Context, user): Promise<void> {
    if (!this.passport) {
        throw new Error('passport.initialize() middleware not in use');
    }
    const property = (this.passport && this.passport.UserProperty);
    this.state[property] = user;
    let obj;
    try {
        obj = await this.passport.serializeUser(user, this);
    } catch (err) {
        this.state[property] = null;
        throw err;
    }
    if (!this.session) {
        throw new Error('Should use session middleware before passport middleware');
    }
    this.session.passport.user = obj;
    return Promise.resolve();
}

/**
 * Terminate an existing login session.
 *
 * @api public
 */
function logout(this: Context): void {
    if (!this.passport || !this.session) {
        return;
    }
    const property = this.passport.UserProperty;
    this.state[property] = null;
    // if (this._passport && this._passport.session) {
    //     delete this._passport.session.user;
    // }
    this.session.passport.user = undefined;
}

/**
 * Test if request is authenticated.
 *
 * @api public
 */
function isAuthenticated(this: Context): boolean {
    if (!this.passport) {
        return false;
    }
    const property = this.passport.UserProperty;
    return (this.state[property]) ? true : false;
}

/**
 * Test if request is unauthenticated.
 *
 * @api public
 */
function isUnauthenticated(): boolean {
    return !this.isAuthenticated();
}

/**
 * context extends.
 *
 * @export
 * @param {BaseContext} ctx
 * @returns {void}
 */
export function contextExtends(ctx: BaseContext): void {
    // add passport http.IncomingMessage extensions
    if (ctx.hasOwnProperty('login') || ctx.hasOwnProperty('logout') ||
        ctx.hasOwnProperty('isAuthenticated') || ctx.hasOwnProperty('isUnauthenticated')) {
        return;
    }

    Object.defineProperties(ctx, {
        login: {
            value: login,
            writable: false,
            enumerable: false,
        },
        logout: {
            value: logout,
            writable: false,
            enumerable: false,
        },
        isAuthenticated: {
            value: isAuthenticated,
            writable: false,
            enumerable: false,
        },
        isUnauthenticated: {
            value: isUnauthenticated,
            writable: false,
            enumerable: false,
        },
    });
}
