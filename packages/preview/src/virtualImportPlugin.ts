import { Plugin } from 'vite'
import { VirtualImportField } from './const'

export default function virtualImportPlugin(fields: VirtualImportField[]): Plugin {
  return {
    name: 'virtual-import-plugin',
    resolveId(id) {
      const field = fields.find(field => field.fieldId === id)
      if (field) {
        return field.fieldId
      }
    },
    load(id) {
      const field = fields.find(field => field.fieldId === id)
      if (field) {
        return field.code
      }
    }
  }
}
