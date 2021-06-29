import fs from 'fs-extra'
import path from 'path'
import download from '../src'
import os from 'os'

const gitRepo = 'https://github.com/Tone/createMockMiddleware.git#master'
const npmPackage = '@tone./create-mock-middleware'

afterAll(() => {
  fs.remove(path.resolve(os.tmpdir(),'dt'))
})

test('download npm package should be right', async () => {
  const dir = await download(npmPackage)
  if (path.extname(dir) === '') {
    expect(fs.existsSync(dir)).toBeTruthy()
  } else {
    expect(path.extname(dir)).toMatch(/js|ts/)
  }
})

test('download git repo should be right', async () => {
  const dir = await download(gitRepo)
  if (path.extname(dir) === '') {
    expect(fs.existsSync(dir)).toBeTruthy()
  } else {
    expect(path.extname(dir)).toMatch(/js|ts/)
  }
})

test('dir does not exist should be error', async () => {
  expect.assertions(3);
  try {
    await download(npmPackage+"ssss")
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }

  try {
    await download(gitRepo+"/ssss")
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toMatch('ssss does not exist');
  }
})
