import { Workflow, Task } from '@tsdi/activities';
import { PackModule, LibPackBuilderOption, AssetActivityOption } from '@tsdi/pack';
import { ServerActivitiesModule } from '@tsdi/platform-server-activities';
import { AfterInit } from '@tsdi/components';

@Task({
    deps: [
        PackModule,
        ServerActivitiesModule
    ],
    baseURL: __dirname,
    template: [
        <LibPackBuilderOption>{
            activity: 'libs',
            outDir: '../dist',
            src: 'src/**/*.ts',
            test: 'test/**/*.ts',
            annotation: true,
            bundles: [
                { target: 'es2017', targetFolder: 'src', moduleName: 'main', moduleFolder: 'src' }
            ]
        },
        <AssetActivityOption>{
            activity: 'asset',
            src: 'src/{views,public}/**',
            dist: '../dist/src'
        },
        <AssetActivityOption>{
            activity: 'asset',
            src: 'src/**/*.js',
            dist: '../dist/src'
        }
    ]
})
export class ServerBuilder implements AfterInit {
    onAfterInit(): void | Promise<void> {
        console.log('server build has inited...')
    }
}
