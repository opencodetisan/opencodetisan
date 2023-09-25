import nodemailer from 'nodemailer'

export const sendPassRecoveryMail = async ({recipient, token}: any) => {
  const message = {
    from: process.env.NODEMAILER_USERNAME,
    to: recipient,
    subject: `${process.env.NEXTAUTH_URL}/recover-password?token=${token}`,
    text: 'message',
    html: '<button>HTML version of the message</button>',
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     console.log('Server is ready to take our messages')
  //   }
  // })

  const result = await transporter.sendMail(message)
  return result
}
