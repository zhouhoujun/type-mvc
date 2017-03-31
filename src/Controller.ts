import { MvcContext } from './MvcContext';
import { existsSync, readFile } from 'fs';
import { Buffer } from 'buffer';
import { Stream } from 'stream';
import * as path from 'path';
import { createDefer } from './util';

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
        if (!this.context.render) {
            return Promise.reject('view engin middleware no configed!');
        } else {
            return this.context.render(viewName, model);
        }
    }

    file(file: string | Buffer | Stream, contentType?: string, fileDownloadName?: string) {
        let defer = createDefer<Buffer>();
        if (file instanceof String) {
            let filepath = path.join(this.context.appRoot, file);
            if (existsSync(filepath)) {
                readFile(filepath, contentType || 'utf8', (err, data) => {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(new Buffer(data));
                    }
                });
            }
        }
        return defer.promise;
    }
}
