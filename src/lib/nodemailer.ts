import nodemailer from 'nodemailer'
import prisma from './db/client';

let smtpDetails: any;

export async function getSmtpDetails() {
  try {
    smtpDetails = await prisma.mailSetting.findFirst();
    return smtpDetails;
  } catch (error) {
    console.error('Error retrieving SMTP details:', error);
    throw error;
  }
}

export async function generateTransporter() {
  const smtpDetails = await getSmtpDetails();

  if (smtpDetails) {
    const transporter = nodemailer.createTransport({
      debug: true,
      logger: true,
      from: smtpDetails.from,
      host: smtpDetails.host,
      port: smtpDetails.port,
      secure: smtpDetails.secure,
      auth: {
        user: smtpDetails.username,
        pass: smtpDetails.password,
      }
    });

    transporter.verify(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    return transporter;
  } 
  else {
    throw new Error('No SMTP details available. Unable to create transporter.');
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
  const message = {
    from: smtpDetails.from,
    to: recipient,
    subject: 'OpenCodetisan password recovery',
    text: 'message',
    html,
  }
  const transporter = await generateTransporter();
  if (transporter) {
    const result = await transporter.sendMail(message);
    return result;
  } else {
    throw new Error('SMTP not found');
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

  const message = {
    from: smtpDetails.from,
    to: recipient,
    subject: 'OpenCodetisan assessment invitation',
    text: 'message',
    html,
  }
  const transporter = await generateTransporter();
  if (transporter) {
    const result = await transporter.sendMail(message);
    return result;
  } else {
    throw new Error('SMTP not found');
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
  const message = {
    from: smtpDetails.from,
    to: recipient,
    subject: 'Account created in OpenCodetisan',
    text: 'message',
    html,
  }

  const transporter = await generateTransporter();
  if (transporter) {
    const result = await transporter.sendMail(message);
    return result;
  } else {
    throw new Error('SMTP not found');
  }
}

