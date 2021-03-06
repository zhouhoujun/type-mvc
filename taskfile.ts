import { Workflow, Task, Activities, isAcitvityClass, Activity, EachTeamplate, ActivityTemplate } from '@tsdi/activities';
import * as path from 'path';
import { PackModule, NodeActivityContext, ShellActivityOption, JsonReplaceActivityOption } from '@tsdi/pack';
import { Type, isString } from '@tsdi/ioc';
import { ServerActivitiesModule } from '@tsdi/platform-server-activities';
import * as through from 'through2';

// build with command `tsdi build --setvs=version --deploy`
@Task({
    deps: [
        PackModule,
        ServerActivitiesModule
    ],
    baseURL: __dirname,
    template: <ActivityTemplate>[
        {
            activity: Activities.if,
            condition: (ctx: NodeActivityContext) => {
                let unp = ctx.platform.getEnvArgs().unp;
                return isString(unp) && /\d+.\d+.\d+/.test(unp);
            },
            body: <ShellActivityOption>{
                activity: 'shell',
                shell: (ctx: NodeActivityContext) => {
                    let packages = ctx.platform.getFolders('packages').filter(f => !/(orm|simples)$/.test(f));
                    let version = ctx.platform.getEnvArgs().unp;
                    let cmds = [];
                    packages.forEach(fd => {
                        let objs = require(path.join(fd, 'package.json'));
                        if (objs && objs.name) {
                            cmds.push(`npm unpublish ${objs.name}@${version}`)
                        }
                    });
                    console.log(cmds);
                    return cmds;
                }
            }
        },
        {
            activity: Activities.elseif,
            condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().build !== 'false',
            body: [
                {
                    activity: Activities.if,
                    condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().setvs,
                    body: [{
                        activity: 'asset',
                        name: 'version-setting',
                        src: 'packages/**/package.json',
                        dist: 'packages',
                        pipes: [
                            <JsonReplaceActivityOption>{
                                activity: 'jsonReplace',
                                fields: (json, ctx) => {
                                    let chgs = new Map<string, any>();
                                    let version = ctx.platform.getEnvArgs().setvs;
                                    chgs.set('version', version);
                                    let iocVersion: string = ctx.platform.getPackage().devDependencies['@tsdi/ioc'];
                                    iocVersion = iocVersion.replace(/^(\^|=|~)/ig, '');
                                    Object.keys(json.peerDependencies || {}).forEach(key => {
                                        if (/^@mvx/.test(key)) {
                                            chgs.set('peerDependencies.' + key, '~' + version);
                                        }
                                    });
                                    Object.keys(json.dependencies || {}).forEach(key => {
                                        if (/^@mvx/.test(key)) {
                                            chgs.set('dependencies.' + key, '~' + version);
                                        }
                                    });
                                    Object.keys(json.devDependencies || {}).forEach(key => {
                                        if (/^@mvx/.test(key)) {
                                            chgs.set('devDependencies.' + key, '~' + version);
                                        }
                                    });

                                    Object.keys(json.peerDependencies || {}).forEach(key => {
                                        if (/^@tsdi/.test(key)) {
                                            chgs.set('peerDependencies.' + key, '~' + iocVersion);
                                        }
                                    });
                                    Object.keys(json.dependencies || {}).forEach(key => {
                                        if (/^@tsdi/.test(key)) {
                                            chgs.set('dependencies.' + key, '~' + iocVersion);
                                        }
                                    });
                                    Object.keys(json.devDependencies || {}).forEach(key => {
                                        if (/^@tsdi/.test(key)) {
                                            chgs.set('devDependencies.' + key, '~' + iocVersion);
                                        }
                                    });
                                    return chgs;
                                }
                            }]
                    },
                    {
                        activity: 'asset',
                        src: 'package.json',
                        dist: '.',
                        pipes: [
                            <JsonReplaceActivityOption>{
                                activity: 'jsonReplace',
                                fields: (json, ctx) => {
                                    let version = ctx.platform.getEnvArgs().setvs;
                                    return { version: version };
                                }
                            }]
                    }]
                },
                {
                    activity: 'shell',
                    parallel: true,
                    shell: (ctx: NodeActivityContext) => {
                        let pks = ctx.platform.getFolders('packages').filter(f => !/(orm|identity-server|simples|package)$/.test(f))
                        return pks.map(p => `cd ${p} && tsdi build`);
                    }
                },
                {
                    activity: 'asset',
                    src: 'dist/**/*.d.ts',
                    pipes: [
                        () => through.obj(function (file, encoding, callback) {
                            if (file.isNull()) {
                                return callback(null, file);
                            }

                            if (file.isStream()) {
                                return callback('doesn\'t support Streams');
                            }

                            let contents: string = file.contents.toString('utf8');
                            let sets: string[] = [];
                            contents = contents.replace(/set\s\w+\(.+\)\;/g, match => {
                                sets.push(match.substring(4, match.indexOf('(')));
                                return '';
                            });
                            contents = contents.replace(/get\s\w+\(\)\:\s/g, match => {
                                let field = match.substring(4, match.length - 4);
                                return `${sets.indexOf(field) >= 0 ? '' : 'readonly '}${field}:`;
                            });

                            file.contents = Buffer.from(contents);
                            callback(null, file);
                        })
                    ],
                    dist: 'dist'
                }
                // <EachTeamplate>{
                //     activity: Activities.each,
                //     each: (ctx: NodeActivityContext) => ctx.platform.getFolders('packages').filter(f => !/(cli|orm|identity-server|simples)$/.test(f)),
                //     parallel: true,
                //     body: {
                //         activity: Activities.execute,
                //         action: async (ctx) => {
                //             let activitys = Object.values(require(path.join(ctx.body, 'taskfile.ts'))).filter(b => isAcitvityClass(b)) as Type<Activity<any>>[];
                //             // await ctx.getExector().execActivity(ctx, activitys);
                //             await Workflow.sequence(...activitys);
                //         }
                //     }
                // }
            ]
        },
        {
            activity: Activities.if,
            condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().deploy,
            body: <ShellActivityOption>{
                activity: 'shell',
                shell: (ctx: NodeActivityContext) => {
                    let packages = ctx.platform.getFolders('dist');
                    let cmd = 'npm publish --access=public'; // envArgs.deploy ? 'npm publish --access=public' : 'npm run build';

                    let shells = packages.map(fd => {
                        return `cd ${fd} && ${cmd}`;
                    });
                    console.log(shells);
                    return shells;
                }
            }
        }
    ]
})
export class BuilderMVX {

}

