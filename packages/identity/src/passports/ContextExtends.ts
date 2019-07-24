import { BaseContext, Context } from 'koa';
import './IAuthenticator';

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
    const property = (this.passport && this.passport.userProperty);
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
    const property = this.passport.userProperty;
    delete this.state[property];
    delete this.session.passport.user;
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
    const property = this.passport.userProperty;
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

function hasRole(this: Context, ...roles: string[]): boolean {
    if (!this.passport) {
        return false;
    }
    if (!roles.length) {
        return true;
    }
    const property = this.passport.rolesProperty;
    if ((this.state[property])) {
        return this.state[property].some(role => roles.indexOf(role) > 0);
    }
    return false;
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
        hasRole: {
            value: hasRole,
            writable: false,
            enumerable: false,
        }
    });
}
