import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {toast} from '@/components/ui/use-toast'
import {StatusCode} from '@/enums'
import {ReactElement, useEffect, useState} from 'react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'

export default function SessionReplayDialog({
  children,
  assessmentSubmissions, // Todo: type
}: any) {
  const [replayer, setReplayer] = useState<any>()
  const [replayerEvent, setReplayerEvent] = useState<any>()
  const [replayerSpot, setReplayerSpot] = useState<ReactElement | []>([])

  useEffect(() => {
    if (replayerEvent && Object.keys(replayerSpot).length !== 0) {
      replaySession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayerSpot])

  const onReplaySession = async ({
    assessmentQuizSubmissionId,
  }: {
    assessmentQuizSubmissionId: string
  }) => {
    setReplayerSpot([])

    try {
      const response = await fetch(
        `/api/session-replay/${assessmentQuizSubmissionId}`,
      )

      if (response.status === StatusCode.InternalServerError) {
        return toast({
          title: 'Internal server error',
          description: 'Failed to delete assessment.',
          variant: 'destructive',
        })
      }

      const json = await response.json()
      setReplayerEvent(json.data)

      replayer?.pause()
      replayer?.getReplayer().destroy()
      setReplayer(null)
      setReplayerSpot(<div id='replayer-spot'></div>)
    } catch (error) {
      console.log(error)
    }
  }

  const replaySession = () => {
    if (replayer) {
      return
    } else if (replayerEvent.length < 2) {
      return toast({
        title: 'Failed to replay empty session.',
      })
    }

    const newReplayer = new rrwebPlayer({
      target: document.getElementById('replayer-spot')!,
      props: {
        height: 650,
        width: 1200,
        events: replayerEvent,
        skipInactive: false,
      },
    })

    newReplayer.play()
    setReplayer(newReplayer)
  }

  // Todo: type
  const submissionRow = assessmentSubmissions.data.map((submission: any) => {
    const quiz = submission.quiz
    return (
      <TableRow key={submission.id}>
        <TableCell className='font-medium '>
          <p className='w-[200px] line-clamp-2'>{quiz.title}</p>
        </TableCell>
        <TableCell className='text-right'>
          <Button
            onClick={() =>
              onReplaySession({
                assessmentQuizSubmissionId:
                  submission.assessmentQuizSubmissions[0].id,
              })
            }
          >
            Play
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[97vw] h-[85vh]'>
        <div className='flex justify-between items-start'>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{submissionRow}</TableBody>
            </Table>
          </div>
          <div>{replayerSpot}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
