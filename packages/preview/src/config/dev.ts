import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import reactRefresh from '@vitejs/plugin-react-refresh'
import vueJsx from '@vitejs/plugin-vue-jsx'

import getBaseConfig from './base'
import virtualImportPlugin from '../virtualImportPlugin'
import { VirtualImportField, ValidExecType, ExecType } from '../const'


function getPlugins(execType: ValidExecType) {
  switch (execType) {
    case ExecType.REACT:
      return [reactRefresh()]
    case ExecType.VUE2:
    case ExecType.VUE3:
      return [
        vue(),
        vueJsx(),
      ]
  }
}

export default function getDevConfig(virtualImportFields: VirtualImportField[], execType: ValidExecType): UserConfig {

  return {
    ...getBaseConfig(),
    plugins: [
      ...getPlugins(execType),
      virtualImportPlugin(virtualImportFields),
    ]
  }
}
