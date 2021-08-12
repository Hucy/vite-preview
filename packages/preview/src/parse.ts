import MarkdownIt from 'markdown-it'
import fs from 'fs-extra'

const MD = new MarkdownIt()
const codeType = [
  'js'
]

export function parseMD(filePath: string): string[] {
  const mdStr = fs.readFileSync(filePath).toString()
  const tokens = MD.parse(mdStr, {}).filter(token => token.tag === 'code' && codeType.includes(token.info))
  return tokens.map(token => token.content)
}
