import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
const nodemailerSendgrid = require('nodemailer-sendgrid');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY2,
      }),
    );

    console.log('email to send', process.env.SUPPORT_EMAIL);

    const email = {
      from: process.env.SUPPORT_EMAIL,
      replyTo: req.body.email,
      to: process.env.SUPPORT_EMAIL,
      subject: `[Support] ${req.body.subject}`,
      text: `From: ${req.body.name}\nReply To: ${req.body.email}\n\n${req.body.message}`,
    };

    transport.sendMail(email, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: ' + info.response);
      }
    });
    res.status(200).json({});
  }
}
