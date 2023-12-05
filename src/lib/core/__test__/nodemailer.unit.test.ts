// import {faker} from '@faker-js/faker'
// import {prismaMock} from '@/lib/db/prisma-mock-singleton'
// import {
//     generateTransporter
//   } from '@/lib/nodemailer'

// const string = faker.lorem.text()
// const number = faker.number.int()
// const email = faker.internet.email()
// const bool = faker.datatype.boolean()

// const fakeGenerateTransporterTest = {
//     host: string,
//     port: number,
//     secure: bool,
//     username: email,
//     password: string,
// }

// describe('Nodemailer module', () => {
//     test('generateNodemailer fx should create and return the transporter', async () => {
//       const settingData: any = {
//         host: faker.lorem.text(),
//         port: faker.number.int(),
//         secure: faker.datatype.boolean(),
//         username: faker.internet.email(),
//         password: faker.lorem.text(),
//       }
//       prismaMock.mailSetting.create.mockResolvedValue(fakeGenerateTransporterTest)
//       const generateTransport = await generateTransporter(settingData)
//       expect(generateTransport).toEqual(settingData)
//     })
// })

////////////////////////////// commented the above one for a while ////////////////////////////////



// jest.mock('nodemailer')
// import nodemailer from 'nodemailer'

// const sendMailMock = jest.fn()
// // TODO: fix type error
// // @ts-ignore
// nodemailer.createTransport.mockReturnValue({sendMail: sendMailMock})

// const nodemailerResponse = {
//   accepted: ['example@gmail.com'],
//   rejected: [],
//   ehlo: [],
//   envelopeTime: faker.number.int(),
//   messageTime: faker.number.int(),
//   messageSize: faker.number.int(),
//   response: faker.lorem.text(),
//   envelope: {from: 'example@gmail.com', to: ['example@gmail.com']},
//   messageId: faker.lorem.text(),
// }