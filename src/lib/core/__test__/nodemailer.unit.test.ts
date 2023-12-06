import { getDbSmtpDetails, generateTransporter } from '@/lib/nodemailer';

describe('Nodemailer module', () => {
  test('generateTransporter should create and return the transporter', async () => {
    const transporter = generateTransporter(getDbSmtpDetails)
      expect(transporter).toBeDefined();
  });
});