import Docker from 'dockerode'
import {NextResponse} from 'next/server'

export async function POST(
  request: Request,
  {params}: {params: {qid: string}},
) {
  try {
    const json = {
      language: 'javascript',
      files: [{name: 'main', content: 'return 42'}],
    }
    const jsonString = JSON.stringify(json)

    // DOCKER_SOCKET_PATH=/var/run/docker.sock
    // DOCKER_IMAGE_ID=javascript:yrn6kc5ic5vd1dy6dn0mphzg1hzmxhfl
    const docker = new Docker({
      socketPath: process.env.DOCKER_SOCKET_PATH,
    })

    //////////////////////////////////////////////////////////
    const container = await docker.createContainer({
      Tty: false,
      OpenStdin: true,
      Image: process.env.DOCKER_IMAGE_ID,
      Cmd: [],
    })
    await container.start()

    console.log(process.env.DOCKER_IMAGE_ID)
    const stream = await container.attach({
      stderr: true,
      stdout: true,
      stream: true,
      stdin: true,
    })

    await container.modem.demuxStream(stream, process.stdout, process.stderr)

    console.log('Write to stream')
    stream.write(jsonString)
    //
    // console.log('Pipe to stdout')
    // stream.pipe(process.stdout)

    // console.log('wait')
    // const data = await container.wait()

    // stream.end()

    console.log('End the stream')
    stream.on('end', function () {
      console.log('Stream ended')
      stream.removeAllListeners()
    })

    stream.on('error', function (err) {
      console.error('Stream error:', err)
    })

    console.log('Stop container')
    await container.stop()

    //////////////////////////////////////////////////////////

    // Create a readable stream from the JSON input
    // const readableStream = new Readable()
    // readableStream.push(jsonString)
    // readableStream.push(null) // Signal the end of the stream
    // readableStream.pipe()

    // console.log(process.env.DOCKER_IMAGE_ID)
    // process.stdout.write(jsonString)
    // await docker.run(
    //   process.env.DOCKER_IMAGE_ID!,
    //   ['echo', '123'],
    //   // [readableStream, process.stdout],
    //   [process.stdout, process.stdout, process.stdout],
    //   {
    //     Tty: false,
    //     // OpenStdin: true,
    //   },
    // )

    //////////////////////////////////////////////////////////

    // var attach_opts = {stream: true, stdin: true, stdout: true, stderr: true}
    // container.attach(attach_opts, function handler(err, stream) {
    //   // Show outputs
    //   stream.pipe(process.stdout)
    //
    //   // Connect stdin
    //   // var isRaw = process.isRaw
    //   // process.stdin.resume()
    //   // process.stdin.setEncoding('utf8')
    //   // process.stdin.setRawMode(true)
    //   process.stdin.pipe(stream)
    //
    //   container.start(function (err, data) {
    //     // resize(container)
    //     // process.stdout.on('resize', function () {
    //     //   resize(container)
    //     // })
    //     //
    //     // container.wait(function (err, data) {
    //     //   exit(stream, isRaw)
    //     // })
    //   })
    // })

    //////////////////////////////////////////////////////////////////

    // await docker.run(
    //   process.env.DOCKER_IMAGE_ID as string,
    //   ['echo', '123'],
    //   [process.stdout, process.stderr],
    //   {Tty: false, OpenStdin: true},
    //   // function (err, data, container) {
    //   //   console.log(data.StatusCode)
    //   // },
    // )
    //
    // container.attach(
    //   {stderr: true, stdout: true, stdin: true, stream: true},
    //   function (err, stream) {
    //     if (err) {
    //       console.error('Error attaching to the container:', err)
    //       return
    //     }
    //     container.modem.demuxStream(stream, process.stdout, process.stderr)
    //     stream.on('data', (data) => {
    //       console.log(data.toString())
    //     })
    //     stream.write(jsonString)
    //     // stream.end()
    //     stream.on('end', function () {
    //       console.log('Stream ended')
    //       stream.removeAllListeners()
    //     })
    //     stream.on('error', function (err) {
    //       console.error('Stream error:', err)
    //     })
    //   },
    // )
    // await container.stop()

    //
    ///////////////////////////////////////////////////

    // /////////////////////////////////////////////////////
    // const stream = await container.attach({
    //   stream: true,
    //   stdin: true,
    //   stdout: true,
    //   stderr: true,
    // })
    // stream.write(
    //   '{"language": "javascript", "files": [{"name": "main", "content": "return (42)"}]}',
    // )
    //
    // stream.pipe(process.stdout, {
    //   end: true,
    // })
    //
    // stream.on('end', function () {})

    return NextResponse.json(jsonString)
  } catch (error) {
    console.log(error)
    return NextResponse.json({})
  }
}
