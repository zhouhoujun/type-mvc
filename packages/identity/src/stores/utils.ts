import * as crypto from 'crypto';
import { Context } from 'koa';



export namespace OIDCUtils {

    /**
     * Reconstructs the original URL of the request.
     *
     * This function builds a URL that corresponds the original URL requested by the
     * client, including the protocol (http or https) and host.
     *
     * If the request passed through any proxies that terminate SSL, the
     * `X-Forwarded-Proto` header is used to detect if the request was encrypted to
     * the proxy.
     *
     * @return {String}
     * @api private
     */
    export function originalURL(ctx: Context, options) {
        options = options || {};
        var app = ctx.app;
        if (app && ctx.get && ctx.get('trust proxy')) {
            options.proxy = true;
        }
        var trustProxy = options.proxy;

        var proto = (ctx.headers['x-forwarded-proto']?.toString() || '').toLowerCase()
            , tls = ctx.connection.encrypted || (trustProxy && 'https' === proto.split(/\s*,\s*/)[0])
            , host = (trustProxy && ctx.headers['x-forwarded-host']) || ctx.headers.host
            , protocol = tls ? 'https' : 'http'
            , path = ctx.url || '';
        return protocol + '://' + host + path;
    };

    /**
     * Merge object b with object a.
     *
     *     var a = { foo: 'bar' }
     *       , b = { bar: 'baz' };
     *
     *     utils.merge(a, b);
     *     // => { foo: 'bar', bar: 'baz' }
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     * @api private
     */

    export function merge(a, b) {
        if (a && b) {
            for (var key in b) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * Return a unique identifier with the given `len`.
     *
     *     utils.uid(10);
     *     // => "FDaS435D2z"
     *
     * CREDIT: Connect -- utils.uid
     *         https://github.com/senchalabs/connect/blob/2.7.2/lib/utils.js
     *
     * @param {Number} len
     * @return {String}
     * @api private
     */

    export function uid(len) {
        return crypto.randomBytes(Math.ceil(len * 3 / 4))
            .toString('base64')
            .slice(0, len);
    }
}
