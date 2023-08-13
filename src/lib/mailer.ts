import {IAssessmentEmailProps} from '@/types'
import {MailerSend, EmailParams, Recipient} from 'mailersend'

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
})

export enum Locale {
  EN = 'en',
  ZH_CN = 'zh-cn',
}

export const getAssessmentInviteTemplate = (locale: string) => {
  switch (locale) {
    case Locale.EN:
      return process.env.EN_ASSESSMENT_TEMPLATE_ID
    case Locale.ZH_CN:
      return process.env.ZH_CN_ASSESSMENT_TEMPLATE_ID
    default:
      return process.env.EN_ASSESSMENT_TEMPLATE_ID
  }
}

export const sendAssessmentEmail = async ({
  locale,
  recipient,
  assessmentUrl,
  companyName,
}: IAssessmentEmailProps) => {
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
