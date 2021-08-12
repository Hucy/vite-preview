#!/usr/bin/env node
import * as yargs from 'yargs'
import path from 'path'

import { checkExecType } from './utils'
import { ExecType, ParseCodeType, CWD } from './const'
import { startDev } from './index'

const argv = yargs
  .command('* [file]', 'preview app file or md code', (yargs) => {
    return yargs.positional('file', {
      describe: 'entry file app.* or readme.md',
      type: 'string',
    }).option('mode', {
      alias: 'm',
      choices: [ParseCodeType.MD, ParseCodeType.RAW],
      describe: 'preview mode',
      default: ParseCodeType.RAW
    }).option('type', {
      alias: 't',
      choices: [ExecType.REACT, ExecType.VUE2, ExecType.VUE3],
      describe: 'preview framework auto check form package.json',
      default: checkExecType()
    }).option('port', {
      alias: 'p',
      type: 'number',
      default: 3000,
      describe: 'port'
    })
  }, (argv) => {
    const { file, mode, type, port } = argv
    if (type === ExecType.NONE) return
    const absoluteFilePath = file ? path.resolve(CWD, file) : file
    startDev({
      execType: type,
      file: absoluteFilePath,
      port,
      mode,
    })
  })
  .help()
  .argv

export default argv
