import MDEditor from '@uiw/react-md-editor'

export function QuizInstruction({
  className,
  title,
  instruction,
  setInstruction,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div>
      <MDEditor
        className='border-white'
        height={400}
        data-color-mode='light'
        value={instruction}
        onChange={setInstruction}
        {...props}
      />
    </div>
  )
}
