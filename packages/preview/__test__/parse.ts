import path from 'path'

import { parseMD } from '../src/parse'

test('parse markdown file', () => {
  const codeStrList = parseMD(path.resolve(__dirname, './test.md'))
  expect(codeStrList.length).toBe(2)
})
