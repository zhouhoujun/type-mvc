#!/usr/bin/env node
import { rm, cp, mkdir } from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as program from 'commander';
import { isString, isArray, isBoolean } from 'util';
import { existsSync } from 'fs';
import { join, normalize } from 'path';
import { exec } from 'child_process';
const resolve = require('resolve');
const cliRoot = path.join(path.normalize(__dirname), '../');
const packageConf = require(cliRoot + '/package.json');
const processRoot = path.join(path.dirname(process.cwd()), path.basename(process.cwd()));
process.env.INIT_CWD = processRoot;

let cwdPackageConf = path.join(processRoot, '/package.json');
if (!fs.existsSync(cwdPackageConf)) {
    cwdPackageConf = undefined;
}

function requireCwd(id: string) {
    try {
        return require(resolve.sync(id, { basedir: processRoot, package: cwdPackageConf }));
    } catch (err) {
        // require ts-config/paths or globals
        return require(id);
    }
}

requireCwd('ts-node').register();

if (process.argv.indexOf('scaffold') > -1) {
    process.argv.push('--verbose');
}


function requireRegisters() {
    requireCwd('tsconfig-paths').register();
}

function runActivity(fileName, options) {
    const wf = requireCwd('@tsdi/activities');
    // const pk = requireCwd('@tsdi/pack');

    let config;
    if (options.config && isString(options.config)) {
        config = requireCwd(options.config);
    }
    config = config || {};
    if (isBoolean(options.debug)) {
        config.debug = options.debug;
    }

    let md = requireCwd(fileName);
    let activites = Object.values(md);
    if (activites.some(v => wf.isAcitvityClass(v))) {
        wf.Workflow.sequence(...activites.filter(v => wf.isAcitvityClass(v)));
    }
}

function vaildifyFile(fileName): string {
    fileName = normalize(fileName);
    if (!fileName) {
        if (fs.existsSync(path.join(processRoot, 'taskfile.ts'))) {
            fileName = 'taskfile.ts';
        } else if (fs.existsSync(path.join(processRoot, 'taskfile.js'))) {
            fileName = 'taskfile.js';
        }
    }
    if (!fs.existsSync(path.join(processRoot, fileName))) {
        console.log(chalk.red(`'${path.join(processRoot, fileName)}' not exsists`));
        process.exit(1);
    }
    return path.join(processRoot, fileName);
}

function copyDir(src: string | string[], dist: string, options?: { force?: boolean }) {
    if (!existsSync(dist)) {
        mkdir('-p', dist);
    }
    if (options && options.force) {
        rm('-rf', normalize(join(dist, '/')));
        mkdir('-p', normalize(join(dist, '/')));
        cp('-R', normalize(src + '/*'), normalize(join(dist, '/')));
    } else {
        cp('-R', normalize(src + '/*'), normalize(join(dist, '/')));
    }
}

program
    .command('test [files]')
    .description('run activity file.')
    .option('--config [string]', 'config file path.')
    .option('-b, --browser [bool]', 'test browser project or not.')
    .option('--debug [bool]', 'enable debug log or not')
    .action((files, options) => {
        requireRegisters();
        if (isArray(files)) {
            files = files.filter(f => f && isString(f));
        } else {
            if (!files || !isString(files)) {
                files = 'test/**/*.ts';
            }
        }
        let unit = requireCwd('@tsdi/unit');
        let reporter;
        if (options.browser) {
            reporter = requireCwd('@tsdi/unit-karma');
        } else {
            reporter = requireCwd('@tsdi/unit-console').ConsoleReporter;
        }
        let config;
        if (isString(options.config)) {
            config = requireCwd(options.config);
        }
        config = config || {};
        config.baseURL = config.baseURL || processRoot;
        if (isBoolean(options.debug)) {
            config.debug = options.debug;
        }
        unit.runTest(files, config, reporter);
    });


program
    .command('run [fileName]')
    .description('run activity file.')
    .option('--activity [bool]', 'target file is activity.')
    .option('--config [string]', 'path to configuration file for activities build')
    .option('--debug [bool]', 'enable debug log or not')
    .allowUnknownOption(true)
    .action((fileName, options) => {
        requireRegisters();
        if (options.activity) {
            runActivity(vaildifyFile(fileName), options)
        } else {
            fileName = vaildifyFile(fileName || 'src/app.ts');
            requireCwd(resolve.sync(fileName, { basedir: processRoot, package: cwdPackageConf }));
        }
    });

program
    .command('build [taskfile]')
    .description('build the application')
    .option('--boot [bool]', 'target file with Workflow instace to boot activity.')
    .option('-e, --env [string]', 'use that particular environment.ts during the build, just like @angular/cli')
    .option('-c, --clean [bool]', 'destroy the build folder prior to compilation, default for prod')
    .option('-w, --watch [bool]', 'listen for changes in filesystem and rebuild')
    .option('--config [string]', 'path to configuration file for activities build')
    .option('--debug [bool]', 'enable debug log or not')
    .option('-d, --deploy [bool]', 'run deploy activity')
    .option('--verbose [bool]', 'log all messages in list format')
    .option('--closure [bool]', 'bundle and optimize with closure compiler (default)')
    .option('-r, --rollup [bool]', 'bundle with rollup and optimize with closure compiler')
    .allowUnknownOption(true)
    .action((taskfile, options) => {
        requireRegisters();
        taskfile = vaildifyFile(taskfile);
        if (options.boot) {
            requireCwd(taskfile);
        } else {
            runActivity(taskfile, options);
        }
    });



program
    .command('new [app]')
    .description('new my-app')
    .action((app, options) => {
        let dist = path.join(processRoot, app);
        if (fs.existsSync(dist)) {
            console.log(chalk.red(app + ' already exists'));
            process.exit();
        }
        copyDir(join(__dirname, '../temp'), dist);
        exec(`cd ${dist} && npm i`, (err, out) => {
            if (err) {
                console.error(err);
            } else {
                console.log(out);
            }
        });
    });
// .command('g, generate [string]')
// .description('generate schematics packaged with cmd')
// .option('--ng [bool]', 'generate angular project')
// .action((build, options) => {

// });


program.parse(process.argv);
