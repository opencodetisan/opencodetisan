import nodemailer from 'nodemailer'

export const sendPassRecoveryMail = async ({recipient, token}: any) => {
  const link = `${process.env.NEXTAUTH_URL}/recover-password?token=${token}`
  const html = `
      <p>You have requasted an password reovery. Follow the link below to recover your password</p>
      <div>
        <a href="${link}">Click here</a> to recover your password.
      </div>
  `

  const message = {
    from: process.env.NODEMAILER_USERNAME,
    to: recipient,
    subject: 'OpenCodetisan password recovery',
    text: 'message',
    html,
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

  const result = await transporter.sendMail(message)
  return result
}
