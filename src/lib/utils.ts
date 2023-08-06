import {compressSync, strToU8} from 'fflate'

export const convertToMinuteSecond = (seconds: number) => {
  if (!seconds) {
    throw Error('missing seconds')
  }
  const minutes = Math.floor(seconds / 60)
  const newSeconds = Math.round(seconds - minutes * 60)
  return {minutes, seconds: newSeconds}
}

export const compressJsonStr = (jsonStr: string) => {
  if (!jsonStr) {
    throw Error('missing data')
  }
  const buf = strToU8(jsonStr)
  const compressed = compressSync(buf, {level: 6, mem: 8})
  return compressed
}
