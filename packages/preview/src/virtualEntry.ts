import fs from 'fs-extra'
import path from 'path'

import { MainEntryFile, MainEntryMountID, ExecType, ValidExecType, MainEntry, DevOptions, ParseCodeType, DefaultMDFiles, VirtualEntryMap, CWD } from './const'

import { parseMD } from './parse'

function getEntryFile(execType: ValidExecType, mountId: string, AppFile: string): string {
  switch (execType) {
    case ExecType.REACT:
      return `
      import React from 'react'
      import ReactDOM from 'react-dom'
      import App from '${AppFile}'

      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('${mountId}')
      )
      `
    case ExecType.VUE2:
      return `
      import Vue from 'vue'
      import App from '${AppFile}'
      new Vue({
        render: h => h(App)
      }).$mount('#${mountId}')
      `
    case ExecType.VUE3:
      return `
      import { createApp } from 'vue'
      import App from '${AppFile}'
      createApp(App).mount('#${mountId}')
      `
  }
}

function getRawVirtualEntry(options: DevOptions): MainEntry[] {
  const [defaultApp, _, ext] = VirtualEntryMap[options.execType]
  const AppFile = options.file ?? defaultApp
  const MainEntryFileWithExt = `${MainEntryFile}${ext}`
  const appFile = path.isAbsolute(AppFile) ? AppFile : path.resolve(CWD, AppFile)

  return [{
    fieldId: MainEntryFileWithExt,
    mountId: MainEntryMountID,
    virtualApp: [{
      fieldId: MainEntryFileWithExt,
      code: getEntryFile(options.execType, MainEntryMountID, appFile)
    }]
  }]
}

function getMDVirtualEntry(options: DevOptions): MainEntry[] {
  const mdFile = options.file ?? DefaultMDFiles.find(file => fs.existsSync(file))
  if (!mdFile) throw new Error(`The md file does not exist`)
  const codeStrList = parseMD(mdFile)
  const [_, virtualAppId, ext] = VirtualEntryMap[options.execType]

  return codeStrList.map((code, index) => {
    const mainEntryFile = !index ? MainEntryFile : `${MainEntryFile}${index}`
    const mainMountId = !index ? MainEntryMountID : `${MainEntryMountID}${index}`
    const appFile = !index ? virtualAppId : virtualAppId.replace(/(\.|\b$)/, `${index}$1`)
    const mainEntryFileWithExt = `${mainEntryFile}${ext}`

    const virtualApp = [
      {
        fieldId: mainEntryFileWithExt,
        code: getEntryFile(options.execType, mainMountId, appFile)
      },
      {
        fieldId: appFile,
        code
      }
    ]
    return {
      fieldId: mainEntryFileWithExt,
      mountId: mainMountId,
      virtualApp
    }
  })
}

export function virtualEntry(options: DevOptions): MainEntry[] {
  const isRawMode = !options.mode || options.mode === ParseCodeType.RAW
  if (isRawMode) return getRawVirtualEntry(options)
  return getMDVirtualEntry(options)
}
