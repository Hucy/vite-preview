import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'
import { ExecType, CWD } from './const'



export function checkExecType(cwd: string = CWD): ExecType {
  const packageJsonPath = path.resolve(cwd, 'package.json')

  if (!fs.existsSync(packageJsonPath)) return ExecType.NONE

  const packageJson = fs.readJsonSync(packageJsonPath)
  if (packageJson?.dependencies?.react) return ExecType.REACT
  if (packageJson?.dependencies?.vue) {
    if (semver.lt(packageJson.dependencies.vue, '3.0.0')) return ExecType.VUE2
    return ExecType.VUE3
  }

  return ExecType.NONE
}
