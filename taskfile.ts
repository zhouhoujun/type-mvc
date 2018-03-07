import { Task, ITask, taskSymbols, TaskContainer, AbstractTask, TaskElement, PipeElement, ITaskComponent, IConfigure, PipeComponent, IPipeTaskProvider, TaskModule, ITransform, Src } from 'type-task';
import * as mocha from 'gulp-mocha';

const del = require('del');
const cache = require('gulp-cached');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
let tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
import { classAnnotations } from 'typescript-class-annotations';

@TaskModule({
    providers: <IPipeTaskProvider>{
        name: 'tscomp',
        src: ['src/**/*.ts', '!src/cli/**'],
        dest: 'lib',
        pipes: [
            (ctx) => cache('typescript'),
            (ctx) => classAnnotations(),
            sourcemaps.init,
            (ctx) => tsProject()
        ],
        destPipes: {
            js: [
                (ctx, transform) => {
                    let trans: ITransform = transform.js;
                    trans.changeAsOrigin = true;
                    return trans;
                },
                (ctx) => uglify(),
                (ctx) => sourcemaps.write('./sourcemaps')
            ],
            dts: [
                (ctx, transform) => {
                    let tans: ITransform = transform.dts;
                    tans.changeAsOrigin = true;
                    return tans;
                }
            ]
        }
    },
    task: PipeElement
})
class TsCompile extends TaskElement {
    constructor(name: string, private src?: Src, private dest?: Src) {
        super(name);
    }

    onInit() {
        if (this.src) {
            this.config.providers.src = this.src;
        }
        if (this.dest) {
            this.config.providers.dest = this.dest;
        }
    }
}


@TaskModule({
    providers: {
        name: 'test',
        src: 'test/**/*.spec.ts',
        awaitPiped: true,
        pipes: [() => mocha()]
    },
    task: PipeElement
})
class TestTask extends TaskElement {
    execute(data?: any): Promise<any> {
        return del(['lib/**', 'bin/**']);
    }
}

TaskContainer.create(__dirname)
    .bootstrap([TestTask, TsCompile, {
        providers: {
            src: 'src/cli/*.ts',
            dest: 'bin'
        },
        task: TsCompile
    }]);
