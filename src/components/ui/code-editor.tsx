import CodeMirror from '@uiw/react-codemirror'
import {javascript} from '@codemirror/lang-javascript'
import {CodeLangMode} from '@/enums'

const getLangExtension = (mode: string) => {
  switch (mode) {
    // case CodeLangMode.Csharp:
    //   return [StreamLanguage.define(csharp)]
    case CodeLangMode.Javascript:
      return [javascript()]
    // case CodeLangMode.Python:
    //   return [python()]
    default:
      return []
  }
}

export const CodeEditor = ({
  className,
  value,
  onChange,
  readOnly,
  codeLanguage,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const extension = getLangExtension(codeLanguage)

  return (
    <CodeMirror
      height='384px'
      value={value}
      // theme={githubDark}
      extensions={extension}
      onChange={onChange}
      readOnly={readOnly}
    />
  )
}
