import { IContext } from './IContext';
import { existsSync, readFile } from 'fs';
import { Configuration } from './Configuration';
import { Buffer } from 'buffer';
import { Stream } from 'stream';
import * as path from 'path';

import { Controller, Get } from './decorators';
import { AutoWired } from 'tsioc';
import { Defer, symbols } from './util';
import { ViewResult, ResultValue, FileResult } from './restults';
import { RedirectResult } from './index';


/**
 * Base Controller.
 *
 * @export
 * @class Controller
 */
export abstract class BaseController {

    view(viewName: string, model?: object) {
        return new ViewResult(viewName, model);
    }

    file(file: string | Buffer | Stream, contentType?: string, fileDownloadName?: string) {
        return new FileResult(file, contentType, fileDownloadName);
    }

    /**
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
    redirect(url: string, alt?: string) {
        return new RedirectResult(url, alt);
    }
}
