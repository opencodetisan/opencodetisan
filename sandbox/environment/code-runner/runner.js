#!/usr/bin/env node

import {writeFile} from 'node:fs/promises'
import {spawn} from 'child_process'

const d = []
const stdin = process.stdin
const stdout = process.stdout
const stderr = process.stderr
stdin.setEncoding('utf8')

stdin.on('data', (data) => {
  d.push(data)
})

stdin.on('end', () => {
  try {
    const json = JSON.parse(d)
    if (json) {
      console.log('JSON: ', json)
      const {language, files} = json
      const {name, content} = files[0]
      writeSourceFile({name, content})
      const {buildCommand, runCommand} = formatCommand({
        language,
        name,
      })
      console.log(`runCommand: ${runCommand}`)
      const result = execute({runCommand})
    }
  } catch (e) {
    //stdout.write(e)
    console.log(e)
  }
})

const Language = {
  javascript: 'javascript',
  python: 'python',
}

const writeSourceFile = async ({name, content}) => {
  console.log('content', content)
  await writeFile(`./${name}`, content)
}

const formatCommand = ({language, name}) => {
  switch (language) {
    case Language.javascript:
      return {
        buildCommand: [],
        runCommand: `node ${name}`,
      }
      break
    case Language.python:
      return {
        buildCommand: [],
        runCommand: `python3 ${name}`,
      }
      break
    default:
      return {
        buildCommand: [],
        runCommand: '',
      }
  }
}

const build = () => {}

const execute = ({buildCommand, runCommand}) => {
  const rc = runCommand.split(' ')
  const c = spawn(rc[0], rc.slice(1))
  c.stdout.on('data', (data) => {
    stdout.write(`stdout: ${data}`)
  })
  c.stderr.on('data', (data) => {
    stderr.write(`stderr: ${data}`)
  })
  c.on('close', (code) => {
    stdout.write(`child process exited with code ${code}`)
  })
}
