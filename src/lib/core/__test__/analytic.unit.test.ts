import {
  convertToMinuteSecond,
  getLocalFiles,
  readLocalFile,
  writeLocalFile,
} from '@/lib/utils'
import {faker} from '@faker-js/faker'

const uuid = faker.string.uuid()
const text = faker.lorem.text()
const date = faker.date.anytime()
const number = faker.number.int()

describe('Analytic module', () => {
  test('writeLocalFile fn should create and store data in a new local file', async () => {
    const param = {path: text, data: text}
    expect(await writeLocalFile(param)).toEqual('Hello World')
  })

  test('Missing path param should raise an missing path error', async () => {
    const param: any = {data: text}
    expect(async () => await readLocalFile(param)).rejects.toThrow(
      /^missing path$/,
    )
  })

  test('Missing data param should raise an missing data error', async () => {
    const param: any = {path: text}
    expect(async () => await readLocalFile(param)).rejects.toThrow(
      /^missing data$/,
    )
  })
})
