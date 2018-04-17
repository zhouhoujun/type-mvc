import { ResultValue } from './ResultValue';
import { Stream } from 'stream';
import { IContext } from '../IContext';
import { Defer, MvcSymbols } from '../../util/index';
import { IConfiguration } from '../../IConfiguration';
import { IContainer, isString } from '@ts-ioc/core';
import { existsSync, readFile } from 'fs';
import { join } from 'path';
import { BadRequestError } from '../../errors/index';


/**
 * controller method return result type of file.
 *
 * @export
 * @class FileResult
 */
export class FileResult extends ResultValue {
    constructor(private file: string | Buffer | Stream, contentType?: string, private fileDownloadName?: string) {
        super(contentType);
    }

    async sendValue(ctx: IContext, container: IContainer) {
        let defer = Defer.create<Buffer>();
        let file = this.file;
        let contentType = this.contentType;
        let confige = container.get<IConfiguration>(MvcSymbols.IConfiguration);
        if (isString(file)) {
            let filepath = join(confige.rootdir, file);
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
        return defer.promise
            .then(buffer => {
                if (this.fileDownloadName) {
                    ctx.attachment(this.fileDownloadName);
                }
                ctx.body = buffer;
            }, err => {
                throw new BadRequestError(err.toString())
            });
    }
}
