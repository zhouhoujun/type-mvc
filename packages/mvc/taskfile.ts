import { Pack, PackModule } from '@tsdi/pack';
import { Workflow } from '@tsdi/activities';

@Pack({
    baseURL: __dirname,
    src: 'src',
    clean: 'lib',
    test: 'test/**/*.spec.ts',
    assets: {
        ts: { dest: 'lib', annotation: true, uglify: false, tsconfig: './tsconfig.json' }
    }
})
export class MvcBuilder {
}


if (process.cwd() === __dirname) {
    Workflow.create()
        .use(PackModule)
        .bootstrap(MvcBuilder);
}
