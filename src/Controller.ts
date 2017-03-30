import { MvcContext } from './MvcContext';
import { existsSync, readFile } from 'fs';
import { Buffer } from 'buffer';
import { Stream } from 'stream';
import * as path from 'path';
/**
 * MVC Controller.
 * 
 * @export
 * @class Controller
 */
export class Controller {
    private _context: MvcContext;
    get context(): MvcContext {
        return this._context;
    }
    set context(ctx: MvcContext) {
        this._context = ctx;
    }

    view(viewName: string, model: any) {
        if (!this.context['render']) {
            return Promise.reject('view engin middleware no configed!');
        } else {
            return this.context['render'](viewName, model);
        }
    }

    file(file: string | Buffer | Stream, contentType: string, fileDownloadName?: string) {

        if (file instanceof String) {
            if (existsSync(path.join(this.context.appRoot, file))) {

            }
        }
    }
}
