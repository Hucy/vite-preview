export const MainEntryFile = '/@entry/main'
export const MainEntryMountID = 'app'
export const DefaultMDFiles = ['readme.md', 'README.md']


export const CWD = process.cwd()

export interface MainEntry {
  fieldId: string,
  mountId: string,
  virtualApp: VirtualImportField[]
}

export enum ExecType {
  NONE = 'none',
  REACT = 'react',
  VUE2 = 'vue2',
  VUE3 = 'vue3'
}

export interface VirtualImportField {
  fieldId: string,
  code: string
}


export enum ParseCodeType {
  RAW = 'raw',
  MD = 'md'
}

export type ValidExecType = Exclude<ExecType, ExecType.NONE>

export interface DevOptions {
  execType: ValidExecType,
  file?: string,
  mode?: ParseCodeType
}

type AppFile = [string, string, string]

export const VirtualEntryMap: Record<ValidExecType, AppFile> = {
  [ExecType.REACT]: ['./App.jsx', '@App.jsx', '.jsx'],
  [ExecType.VUE2]: ['./App.vue', '@App.vue', '.js'],
  [ExecType.VUE3]: ['./App.vue', '@App.vue', '.js'],
}
