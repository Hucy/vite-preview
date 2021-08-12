import { ExecType, MainEntryFile, MainEntryMountID, VirtualEntryMap, DevOptions, ParseCodeType } from '../src/const'
import { virtualEntry } from '../src/virtualEntry'

describe('raw mode should be right', () => {
  beforeAll(() => {
    jest.resetModules();
  });
  const table: { options: DevOptions, expected: { appCodeRex: RegExp } }[] = [
    {
      options: {
        execType: ExecType.REACT
      },
      expected: {
        appCodeRex: /react.|\s*react-dom/
      }
    },
    {
      options: {
        execType: ExecType.VUE2,
        file: 'appTest'
      },
      expected: {
        appCodeRex: /vue.|\s*appTest.|\s*\$mount/
      }
    },
    {
      options: {
        execType: ExecType.VUE3,
        mode: ParseCodeType.RAW
      },
      expected: {
        appCodeRex: /vue.|\s*\.\/App.vue.|\s*createApp/
      }
    }
  ]

  test.each(table)('getRawVirtualEntry($options)', async ({ options, expected }) => {
    const mainEntries = virtualEntry(options)
    expect(Array.isArray(mainEntries)).toBeTruthy()
    expect(mainEntries.length).toBe(1)
    expect(mainEntries[0].fieldId).toMatch(MainEntryFile)
    expect(mainEntries[0].mountId).toMatch(MainEntryMountID)
    expect(Array.isArray(mainEntries[0].virtualApp)).toBeTruthy()
    const app = mainEntries[0].virtualApp[0]
    expect(app.code).toMatch(expected.appCodeRex)
  })
})


describe('md mode should be right', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('md file does not exist should throw an error ', async () => {
    jest.doMock('fs-extra', () => {
      return {
        __esModule: true,
        default: {
          existsSync: jest.fn(() => false),
        },
      };
    })

    const { virtualEntry } = await import('../src/virtualEntry')
    expect(() => virtualEntry({
      execType: ExecType.REACT,
      mode: ParseCodeType.MD
    })).toThrow();
  })



  test('md generation code should be right', async () => {
    const codeMock = ['code1', 'code2']
    const parseMDMock = jest.fn(() => codeMock)

    jest.doMock('../src/parse', () => {
      return {
        __esModule: true,
        parseMD: parseMDMock,
      };
    })

    const { virtualEntry } = await import('../src/virtualEntry')
    const options: DevOptions = {
      execType: ExecType.REACT,
      file: 'mdFile',
      mode: ParseCodeType.MD
    }
    const mainEntries = virtualEntry(options)
    expect(parseMDMock).toBeCalledWith('mdFile')
    expect(Array.isArray(mainEntries)).toBeTruthy()
    expect(mainEntries.length).toBe(2)

    mainEntries.forEach(({ fieldId, mountId, virtualApp }, index) => {

      expect(fieldId).toMatch(index ? `${MainEntryFile}${index}` : MainEntryFile)
      expect(mountId).toMatch(index ? `${MainEntryMountID}${index}` : MainEntryMountID)

      const [_, virtualAppId] = VirtualEntryMap[options.execType]
      const appFile = !index ? virtualAppId : virtualAppId.replace(/(\.|\b$)/, `${index}$1`)
      const app = virtualApp[1]
      expect(app.fieldId).toMatch(index ? appFile : virtualAppId)
      expect(app.code).toBe(codeMock[index])
    })
  })
})
