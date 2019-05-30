import { Workflow, Task } from '@tsdi/activities';
import { PackModule, PackMetadata, LibPackBuilderOption, AssetActivityOption } from '@tsdi/pack';
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
            outDir: '../../dist/simples',
            src: 'src/**/*.ts',
            test: 'test/**/*.ts',
            annotation: true,
            bundles: [
                { target: 'es5', targetFolder: 'src', moduleName: 'main', moduleFolder: 'src', dtsMain: 'index.d.ts' },
                { target: 'es2015' },
                { target: 'es2017' }
            ]
        },
        <AssetActivityOption>{
            activity: 'asset',
            src: 'src/{views,public}/**',
            dist: '../../dist/simples'
        },
    ]
})
export class SimpleBuilder implements AfterInit {
    onAfterInit(): void | Promise<void> {
        console.log('mvc build has inited...')
    }
}

if (process.cwd() === __dirname) {
    Workflow.run(SimpleBuilder);
}
