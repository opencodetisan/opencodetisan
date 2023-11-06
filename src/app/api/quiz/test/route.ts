import {NextResponse} from 'next/server'
import Docker from 'dockerode'

export async function GET(request: Request) {
  const docker = new Docker({
    socketPath: process.env.DOCKER_SOCKET_PATH,
  })
  const container = await docker.createContainer({
    OpenStdin: true,
    Image: 'javascript:yrn6kc5ic5vd1dy6dn0mphzg1hzmxhfl',
    Cmd: [],
    // HostConfig: {
    //   Privileged: true,
    // },
  })
  const started = await container.start()

  const stream = await container.attach({
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true,
  })
  stream.write(
    '{"language": "javascript", "files": [{"name": "main", "content": "return (42)"}]}',
  )

  stream.pipe(process.stdout, {
    end: true,
  })

  stream.on('end', function () {})

  await container.stop()

  return NextResponse.json({})
}
