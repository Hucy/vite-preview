import { ExecType, CWD, ParseCodeType } from '../src/const'

beforeEach(() => {
  jest.resetModules()
})

test('framework auto check should be fail', async () => {
  jest.doMock('../src/utils', () => {
    return {
      __esModule: true,
      checkExecType: jest.fn().mockReturnValue(ExecType.NONE)
    }
  })
  jest.spyOn(console, 'error').mockImplementation()
  jest.spyOn(process, 'exit').mockImplementation()
  await import('../src/cli')
  expect(process.exit).toHaveBeenCalledWith(1);
  expect(console.error).toBeCalled();
})

test.each([{
  argv: ['file', '-t', 'vue2'],
  expected: {
    execType: ExecType.VUE2,
    file: `${CWD}/file`,
    mode: ParseCodeType.RAW,
    port: 3000
  }
},
{
  argv: ['-m', 'md', '-p', '3002'],
  expected: {
    execType: ExecType.REACT,
    mode: ParseCodeType.MD,
    port: 3002,
    file: undefined
  }
}
])('$argv starDev call by $expected', async ({ argv, expected }) => {
  process.argv = ['', '', ...argv]
  const startDevMock = jest.fn()
  jest.doMock('../src/index', () => {
    return {
      __esModule: true,
      startDev: startDevMock
    }
  })
  jest.doMock('../src/utils', () => {
    return {
      __esModule: true,
      checkExecType: jest.fn().mockReturnValue(ExecType.REACT)
    }
  })
  await import('../src/cli')
  expect(startDevMock).toBeCalledWith(expected)
})




