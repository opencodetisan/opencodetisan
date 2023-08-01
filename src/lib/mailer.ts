import {MailerSend, EmailParams, Recipient} from 'mailersend'

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
})

export const sendAssessmentEmail = async ({
  locale,
  recipient,
  assessmentUrl,
  companyName,
}: AssessmentEmailProps) => {
  const recipients = [new Recipient(recipient, recipient)]
  const personalization = [
    {
      email: recipient,
      data: {
        assessment_url: assessmentUrl,
        support_email: process.env.GENERAL_SUPPORT_EMAIL,
        email: recipient.replace(/\./g, '​.'),
        company_name: companyName,
      },
    },
  ]
  const emailParams = new EmailParams()
    .setTo(recipients)
    .setTemplateId(getAssessmentInviteTemplate(locale)!)
    .setPersonalization(personalization)
  const result = await mailersend.email.send(emailParams)
  console.log('mailersend.send() result: ', result.statusCode)
  if (result.statusCode === 202) {
    return {statusCode: result.statusCode, errorMessage: undefined}
  } else {
    const errorMessage = result.body
    return {
      statusCode: result.statusCode,
      errorMessage: JSON.stringify(errorMessage),
    }
  }
}
