import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {ReactElement} from 'react'

export default function EditTooltip({children}: {children: ReactElement}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='text-center'>
          <p>Assessment has started.</p>
          <p>Editing has been disabled.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
