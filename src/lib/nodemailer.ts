import nodemailer from 'nodemailer'

export const sendPassRecoveryMail = async ({recipient, token}: any) => {
  const link = `${process.env.NEXTAUTH_URL}/recover-password?token=${token}`
  const html = `
      <p>You have requasted an password reovery. Follow the link below to recover your password</p>
      <div>
        <a href="${link}">Click here</a> to recover your password.
      </div>
      <p>Password recovery session will be closed in 5 minutes.</p>
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

export const sendAssessmentInvitation = async ({
  recipient,
  aid,
}: {
  recipient: string
  aid: string
}) => {
  const link = `${process.env.NEXTAUTH_URL}/c/assessment/${aid}`
  // TODO: html
  const html = `
      <p>Someone from Mars has invited you to an assessment.</p>
      <div>
        <a href="${link}">Click here</a> to view your assessment.
      </div>
  `

  const message = {
    from: process.env.NODEMAILER_USERNAME,
    to: recipient,
    subject: 'OpenCodetisan assessment invitation',
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

export const sendUserCredential = async ({
  recipient,
  password,
}: {
  recipient: string
  password: string
}) => {
  const link = `${process.env.NEXTAUTH_URL}/signin`
  // TODO: html
  const html = `
      <div>
        <p>Your account has been automatically created in OpenCodetisan.</p>
        <p>Username: ${recipient}</p>
        <p>Password: ${password}</p>
        <a href="${link}">Click here</a> to sign-in.
        <p>Remember to change the password.</p>
      </div>
  `

  const message = {
    from: process.env.NODEMAILER_USERNAME,
    to: recipient,
    subject: 'Account created in OpenCodetisan',
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
