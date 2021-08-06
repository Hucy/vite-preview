import fs from 'fs-extra'
import path from 'path'
import semver from 'semver'

export enum EXEC_TYPE {
  NONE,
  REACT,
  VUE2,
  VUE3
}

const CWD = process.cwd()
export default function checkExecType(cwd:string = CWD):EXEC_TYPE {
  const packageJsonPath = path.join(cwd, 'package.json')

  if (!fs.existsSync(packageJsonPath)) return EXEC_TYPE.NONE

  const packageJson = fs.readJsonSync(packageJsonPath)
  if (packageJson?.dependencies?.react) return EXEC_TYPE.REACT
  if (packageJson?.dependencies?.vue) {
    if (semver.lt(packageJson.dependencies.vue, '3.0.0')) return  EXEC_TYPE.VUE2
    return EXEC_TYPE.VUE3
  }
  
  return EXEC_TYPE.NONE
}
