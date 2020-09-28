import { isString } from '@tsdi/ioc';
import { Stream } from 'stream';
import { existsSync, createReadStream } from 'fs';
import { join, isAbsolute } from 'path';
import { Options } from 'content-disposition';
import { ResultValue } from './ResultValue';
import { IContext } from '../IContext';


/**
 * controller method return result type of file.
 *
 * @export
 * @class FileResult
 */
export class FileResult extends ResultValue {
    constructor(private file: string | Buffer | Stream, private options?: { contentType?: string; filename?: string; disposition: Options; }) {
        super(options?.contentType || 'application/octet-stream');
    }

    async sendValue(ctx: IContext) {
        let file = this.file;
        ctx.type = this.contentType;
        if (this.options && this.options.filename) {
            ctx.attachment(this.options.filename, this.options.disposition);
        }
        let confige = ctx.mvcContext.getConfiguration();
        if (isString(file)) {
            let filepath = (isAbsolute(file) || !confige.baseURL) ? file : join(confige.baseURL, file);
            if (existsSync(filepath)) {
                ctx.body = createReadStream(filepath);
            }
        } else if (file instanceof Buffer) {
            ctx.body = file;
        } else if (file instanceof Stream) {
            ctx.body = file;
        }

    }
}
