import { Pack, PackModule, PackActivity } from '@tsdi/pack';
import { Workflow } from '@tsdi/activities';

@Pack({
    baseURL: __dirname,
    src: 'src',
    clean: 'lib',
    test: 'test/**/*.spec.ts',
    assets: {
        ts: { dest: 'lib', annotation: true, uglify: false }
    }
})
export class KoaBuilder {
}

if (process.cwd() === __dirname) {
    Workflow.create()
        .use(PackModule)
        .bootstrap(KoaBuilder);
}
