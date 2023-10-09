import MainComponent from './components'

export default function Quiz({
  className,
  title,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={`${className} flex justify-center pt-6`}>
      <MainComponent />
    </div>
  )
}
