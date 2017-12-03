import * as gulp from 'gulp';
import { ITaskOption, Development } from 'development-tool';
import { Operation } from 'development-core';
// import 'development-tool-node';

Development.create(gulp, __dirname, [
    <ITaskOption>{
        src: 'src',
        dist: 'lib',
        testSrc: 'test/**/*.spec.ts',
        asserts: {
            html: Operation.default,
            js: Operation.default
        },
        loader: 'development-tool-node'
    }
]).start();
