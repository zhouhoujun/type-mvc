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
}
