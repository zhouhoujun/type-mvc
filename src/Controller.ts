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
export abstract class Controller {
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

    file(file: string | Buffer | Stream, contentType?: string, fileDownloadName?: string): Promise<Buffer> {
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
        } else if (file instanceof Buffer) {
            defer.resolve(file);
        } else if (file instanceof Stream) {
            file.once('end', (data) => {
                defer.resolve(new Buffer(data));
            })
                .once('error', defer.reject);
        }
        return defer.promise;
    }
}
