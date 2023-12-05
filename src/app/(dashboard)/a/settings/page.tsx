// import { PageHeader } from '@/components/ui/page-header'
// import {RedirectButton} from '@/components/ui/redirect-button'
import { Separator } from '@/components/ui/separator'
import SettingsCard from './component/SMTPSettings-card'
import { PageHeader } from '@/components/ui/page-header'

export default function Settings() {
    return (
        <>
           <div className='flex justify-between 2xl:px-30 py-12 bg-white'>
             <PageHeader title='Settings' className='ml-20'/>
           </div>
           <Separator />
           <div className='pt-6'>
           <SettingsCard />
           </div>
         </>
    )
}