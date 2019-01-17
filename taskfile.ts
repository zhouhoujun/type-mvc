import { PackModule, isPackClass } from '@ts-ioc/pack';
import { Workflow, SequenceActivityToken, IfActivityToken, ExecuteToken } from '@ts-ioc/activities';
const inplace = require('json-in-place');
import * as through from 'through2';
import * as path from 'path';
import { Asset, AssetToken, INodeActivityContext, NodeActivityContext } from '@ts-ioc/build';

let versionSetting = (ctx: INodeActivityContext) => {
    let envArgs = ctx.getEnvArgs();
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback('doesn\'t support Streams');
        }

        let contents: string = file.contents.toString('utf8');
        let version = envArgs['setvs'] || '';
        if (version) {
            let json = JSON.parse(contents);
            let replaced = inplace(contents)
                .set('version', version);

            Object.keys(json.peerDependencies || {}).forEach(key => {
                if (/^@mvx/.test(key)) {
                    replaced.set('peerDependencies.' + key, '^' + version);
                }
            });
            Object.keys(json.dependencies || {}).forEach(key => {
                if (/^@mvx/.test(key)) {
                    replaced.set('dependencies.' + key, '^' + version);
                }
            });

            contents = replaced.toString();
        }
        file.contents = new Buffer(contents);
        this.push(file);
        callback();
    })
}

let iocVersion = (ctx: INodeActivityContext) => {
    let version = ctx.getPackage().devDependencies['@ts-ioc/core'];
    let envArgs = ctx.getEnvArgs();
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback('doesn\'t support Streams');
        }

        let contents: string = file.contents.toString('utf8');
        if (envArgs['setvs']) {
            let json = JSON.parse(contents);
            let replaced = inplace(contents)
                .set('version', version);

            Object.keys(json.peerDependencies || {}).forEach(key => {
                if (/^@ts-ioc/.test(key)) {
                    replaced.set('peerDependencies.' + key, '^' + version);
                }
            });
            Object.keys(json.dependencies || {}).forEach(key => {
                if (/^@ts-ioc/.test(key)) {
                    replaced.set('dependencies.' + key, '^' + version);
                }
            });

            contents = replaced.toString();
        }
        file.contents = new Buffer(contents);
        this.push(file);
        callback();
    })
}

@Asset({
    pipes: [
        {
            ifBody: {
                sequence: [
                    {
                        src: ['packages/**/package.json', '!node_modules/**/package.json'],
                        pipes: [
                            ctx => versionSetting(ctx),
                            ctx => iocVersion(ctx)
                        ],
                        dest: 'packages',
                        activity: AssetToken
                    },
                    {
                        src: ['package.json'],
                        pipes: [
                            ctx => versionSetting(ctx)
                        ],
                        dest: '.',
                        activity: AssetToken
                    }
                ],
                activity: SequenceActivityToken
            },
            if: ctx => ctx.getEnvArgs().setvs,
            activity: IfActivityToken
        },
        {
            execute: (ctx: INodeActivityContext) => {
                let envArgs = ctx.getEnvArgs();
                let packages = ctx.getFolders('packages').filter(f => !/simples/.test(f)); // (f => !/(annotations|aop|bootstrap)/.test(f));

                let activities = [];
                if (!(envArgs.b === false || envArgs.b === 'false')) {
                    packages.forEach(fd => {
                        let objs = require(path.join(fd, 'taskfile.ts'));
                        let builder = Object.values(objs).find(v => isPackClass(v));
                        activities.push(builder);
                    });
                }
                if (envArgs.deploy) {
                    let cmd = 'npm publish --access=public'; // envArgs.deploy ? 'npm publish --access=public' : 'npm run build';
                    let cmds = packages.map(fd => {
                        return `cd ${fd} && ${cmd}`;
                    });
                    console.log(cmds);
                    activities.push({
                        shell: cmds,
                        activity: 'shell'
                    });
                }
                return {
                    contextType: NodeActivityContext,
                    sequence: activities,
                    activity: SequenceActivityToken
                }
            },
            activity: ExecuteToken
        }
    ]
})
export class BuilderMVC {
}


// Workflow.create()
//     .use(PackModule)
//     .bootstrap(BuilderMVC);

