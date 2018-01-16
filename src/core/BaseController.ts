import { IContext } from './IContext';
import { existsSync, readFile } from 'fs';
import { Buffer } from 'buffer';
import { Stream } from 'stream';
import * as path from 'path';

import { Controller, Get } from './decorators';
import { AutoWired, Injectable, Inject } from 'tsioc';
import { Defer, mvcSymbols } from '../util';
import { ViewResult, FileResult, RedirectResult, JsonResult } from './results';


/**
 * Base Controller.
 *
 * @export
 * @class Controller
 */
@Injectable
export class BaseController {


    @Inject(mvcSymbols.IContext)
    protected context: IContext;

    constructor() {

    }

    /**
     * respone view result.
     *
     * @param {string} viewName
     * @param {object} [model]
     * @returns
     * @memberof BaseController
     */
    view(viewName: string, model?: object): ViewResult {
        return new ViewResult(viewName, model);
    }

    /**
     * respone file result.
     *
     * @param {(string | Buffer | Stream)} file
     * @param {string} [contentType]
     * @param {string} [fileDownloadName]
     * @returns
     * @memberof BaseController
     */
    file(file: string | Buffer | Stream, contentType?: string, fileDownloadName?: string): FileResult {
        return new FileResult(file, contentType, fileDownloadName);
    }

    /**
     * respone redirect result.
     * Perform a 302 redirect to `url`.
     *
     * The string "back" is special-cased
     * to provide Referrer support, when Referrer
     * is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *    this.redirect('back');
     *    this.redirect('back', '/index.html');
     *    this.redirect('/login');
     *    this.redirect('http://google.com');
     * @param {string} url
     * @param {string} [alt]
     * @returns
     * @memberof BaseController
     */
    redirect(url: string, alt?: string): RedirectResult {
        return new RedirectResult(url, alt);
    }

    /**
     * respone json result.
     *
     * @param {object} data
     * @returns
     * @memberof BaseController
     */
    json(data: object): JsonResult {
        return new JsonResult(data);
    }
}
