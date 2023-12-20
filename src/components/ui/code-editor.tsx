import CodeMirror from '@uiw/react-codemirror'
import {javascript} from '@codemirror/lang-javascript'
import {CodeLangMode} from '@/enums'
import {memo} from 'react'
import {python} from '@codemirror/lang-python'
import {csharp} from '@replit/codemirror-lang-csharp'
import {getCodeLanguage} from '@/lib/utils'

const getLangExtension = (mode: string) => {
  switch (mode) {
    case CodeLangMode.Csharp:
      return [csharp()]
    case CodeLangMode.Javascript:
      return [javascript()]
    case CodeLangMode.Python:
      return [python()]
    default:
      return []
  }
}

export const CodeEditor = memo(
  //TODO: type
  ({className, value, onChange, readOnly, codeLanguageId, ...props}: any) => {
    const codeLanguage = getCodeLanguage(parseInt(codeLanguageId)).mode
    const extension = getLangExtension(codeLanguage)

    return (
      <CodeMirror
        height='62vh'
        value={value}
        // theme={githubDark}
        extensions={extension}
        onChange={onChange}
        readOnly={readOnly}
        {...props}
      />
    )
  },
)
CodeEditor.displayName = 'CodeEditor'
