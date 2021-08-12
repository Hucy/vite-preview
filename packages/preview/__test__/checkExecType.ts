
import { CWD, ExecType } from '../src/const'


beforeEach(() => {
  jest.resetModules()
})

test('package.json path parse should be right', async () => {
  const existsSyncMock = jest.fn().mockReturnValue(false)
  jest.mock('fs-extra', () => {
    return {
      __esModule: true,
      default: {
        existsSync: existsSyncMock
      }
    }
  })

  const { checkExecType } = await import('../src/utils')
  const execType = checkExecType()
  expect(existsSyncMock).toBeCalledWith(`${CWD}/package.json`)
  expect(execType).toBe(ExecType.NONE)

  checkExecType('/testCwd')
  expect(existsSyncMock).toBeCalledWith(`/testCwd/package.json`)

})



describe('package.json framework parse should be right', () => {
  test.each([{
    packageJson: {},
    expected: ExecType.NONE
  }, {
    packageJson: {
      dependencies: {
        react: '17.0.1'
      }
    },
    expected: ExecType.REACT
  }, {
    packageJson: {
      dependencies: {
        vue: '2.6.14'
      }
    },
    expected: ExecType.VUE2
  }, {
    packageJson: {
      dependencies: {
        vue: '3.0.0'
      }
    },
    expected: ExecType.VUE3
  },
  ])('$packageJson.dependencies framework parse $expected ', async ({ packageJson, expected }) => {
    const readJsonSyncMock = jest.fn().mockReturnValue(packageJson)

    jest.mock('fs-extra', () => {
      return {
        __esModule: true,
        default: {
          existsSync: jest.fn().mockReturnValue(true),
          readJsonSync: readJsonSyncMock
        }
      }
    })

    const { checkExecType } = await import('../src/utils')
    const execType = checkExecType()
    expect(readJsonSyncMock).toBeCalledWith(`${CWD}/package.json`)
    expect(execType).toBe(expected)
  })
})
