import { PipeModule, Package, PipeElement, TsConfigure, PipeAsset } from '@taskfr/pipes';
import { TaskContainer } from '@taskfr/platform-server';

@Package({
    src: 'src',
    clean: 'lib',
    test: 'test/**/*.spec.ts',
    assets: {
        ts: <TsConfigure>{ dest: 'lib', annotation: true, uglify: false },
        html: { dest: 'lib', task: PipeAsset },
        js: { dest: 'lib', task: PipeAsset }
    }
})
export class Builder extends PipeElement {
}

TaskContainer.create(__dirname)
    .use(PipeModule)
    .bootstrap(Builder);
