import nodemailer from 'nodemailer'
import prisma from './db/client'

export async function getSmtpDetails() {
  try {
    const smtpDetails = await prisma.mailSetting.findUnique({
      where: {
          id: 1,
      },
  })
    return smtpDetails
  } catch (error) {
    console.error('Error retrieving SMTP details:', error)
    throw error
  }
}

export async function getDbSmtpDetails() {
    const dbSmtpDetails = await getSmtpDetails()
    return dbSmtpDetails
}

export function generateTransporter(dbSmtpDetails: any) {
  if (dbSmtpDetails) {
    const transporter = nodemailer.createTransport({
      debug: true,
      logger: true,
      from: dbSmtpDetails.from,
      host: dbSmtpDetails.host,
      port: dbSmtpDetails.port,
      secure: dbSmtpDetails.secure,
      auth: {
        user: dbSmtpDetails.username,
        pass: dbSmtpDetails.password,
      }
    })
    return transporter
  } 
  else {
    throw new Error('No SMTP details available. Unable to create transporter.')
  }
}

export const sendPassRecoveryMail = async ({ recipient, token }: any) => {
  const link = `${process.env.NEXTAUTH_URL}/recover-password?token=${token}`
  const html = `
      <p>You have requested a password recovery. Follow the link below to recover your password</p>
      <div>
        <a href="${link}">Click here</a> to recover your password.
      </div>
      <p>Password recovery session will be closed in 5 minutes.</p>
  `
  try {
    const dbSmtpDetails = await getDbSmtpDetails()

    if (!dbSmtpDetails) {
      throw new Error('SMTP details not found')
    }

    const message = {
      from: dbSmtpDetails.from,
      to: recipient,
      subject: 'OpenCodetisan password recovery',
      text: 'message',
      html,
    }

    const transporter = generateTransporter(dbSmtpDetails)
    if (transporter) {
      const result = await transporter.sendMail(message);
      return result
    } else {
      throw new Error('SMTP transporter not found')
    }
  } catch (error) {
    console.error('Error sending password recovery email:', error)
    throw error
  }
}

export const sendAssessmentInvitation = async ({
  recipient,
  aid,
}: {
  recipient: string
  aid: string
}) => {
  const link = `${process.env.NEXTAUTH_URL}/c/assessment/${aid}`
  const html = `
      <p>You have received an assessment invitation.</p>
      <div>
        Click <a href="${link}">here</a> to view your assessment.
      </div>
  `
  try {
    const dbSmtpDetails = await getDbSmtpDetails()

    if (!dbSmtpDetails) {
      throw new Error('SMTP details not found')
    }

    const message = {
      from: dbSmtpDetails.from,
      to: recipient,
      subject: 'OpenCodetisan password recovery',
      text: 'message',
      html,
    }

    const transporter = generateTransporter(dbSmtpDetails)
    if (transporter) {
      const result = await transporter.sendMail(message);
      return result
    } else {
      throw new Error('SMTP transporter not found')
    }
  } catch (error) {
    console.error('Error sending password recovery email:', error)
    throw error
  }
}

export const sendUserCredential = async ({
  recipient,
  password,
}: {
  recipient: string
  password: string
}) => {
  const link = `${process.env.NEXTAUTH_URL}/signin`
  const html = `
      <div>
        <p>Your account has been automatically created in OpenCodetisan.</p>
        <p>Username: ${recipient}</p>
        <p>Password: ${password}</p>
        <a href="${link}">Click here</a> to sign-in.
        <p>Remember to change the password.</p>
      </div>
  `
  try {
    const dbSmtpDetails = await getDbSmtpDetails()

    if (!dbSmtpDetails) {
      throw new Error('SMTP details not found')
    }

    const message = {
      from: dbSmtpDetails.from,
      to: recipient,
      subject: 'OpenCodetisan password recovery',
      text: 'message',
      html,
    }

    const transporter = generateTransporter(dbSmtpDetails)
    if (transporter) {
      const result = await transporter.sendMail(message);
      return result
    } else {
      throw new Error('SMTP transporter not found')
    }
  } catch (error) {
    console.error('Error sending password recovery email:', error)
    throw error
  }
}