import MDEditor from '@uiw/react-md-editor'

export function QuizInstruction({
  className,
  title,
  instruction,
  setInstruction,
  ...props
} // TODO: type
// }: React.HTMLAttributes<HTMLElement>) {
: any) {
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
