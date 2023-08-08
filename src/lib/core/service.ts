import {compressJsonStr, createDir, readLocalFile, writeToLocal} from '../utils'

export const saveSessionReplayService = ({
  data,
  userId,
  assessmentQuizSubId,
}: {
  data: any
  userId: string
  assessmentQuizSubId: string
}) => {
  let n = 1
  const dir = `./session/${userId}/`
  const filename = `${assessmentQuizSubId}-${n}.txt`
  const pathToFile = `${dir}${filename}`
  const jsonStr = JSON.stringify(data)
  const compressedData = compressJsonStr(jsonStr)
  createDir({path: dir, recursive: true})
  writeToLocal({path: pathToFile, data: compressedData})
}

export const getSessionReplayService = async ({
  userId,
  assessmentQuizSubId,
}: {
  userId: string
  assessmentQuizSubId: string
}) => {}
