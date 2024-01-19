import {getCodeRunnerResultService} from '@/lib/core/service'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
    const {language,solution,testRunner} = await request.json()
    const result = await getCodeRunnerResultService({code:solution,testRunner,language})
    console.log(result)
    
    return NextResponse.json(result)
}

