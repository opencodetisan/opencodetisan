export const convertToMinuteSecond = (seconds: number) => {
  if (!seconds) {
    throw Error('missing seconds')
  }
  const minutes = Math.floor(seconds / 60)
  const newSeconds = Math.round(seconds - minutes * 60)
  return {minutes, seconds: newSeconds}
}
