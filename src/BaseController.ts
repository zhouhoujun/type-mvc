import { IContext } from './IContext';
import { existsSync, readFile } from 'fs';
import { Configuration } from './Configuration';
import { Buffer } from 'buffer';
import { Stream } from 'stream';
import * as path from 'path';

import { Controller, Get } from './decorators';
import { AutoWired } from 'type-autofac';
import { Defer, ContextSymbol } from './util';


/**
 * Base Controller.
 *
 * @export
 * @class Controller
 */
export abstract class BaseController {
    @AutoWired(ContextSymbol)
    context: IContext;

    view(viewName: string, model: any) {
        if (!this.context.render) {
            return Promise.reject('view engin middleware no configed!');
        } else {
            return this.context.render(viewName, model);
        }
    }

    file(file: string | Buffer | Stream, contentType?: string, fileDownloadName?: string): Promise<Buffer> {
        let defer = Defer.create<Buffer>();
        if (file instanceof String) {
            let confige = this.context.container.get(Configuration);
            let filepath = path.join(confige.rootdir, file);
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
