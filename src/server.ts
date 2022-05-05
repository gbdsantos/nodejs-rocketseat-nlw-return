import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0400307a24a58c",
    pass: "be2603c9360339"
  }
});

app.post('/feedbacks', async (request, response) => {
  const { type, comment, screenshot } = request.body;
  
  const feedback = await prisma.feedback.create({
    data: {
      type: type,
      comment: comment,
      screenshot: screenshot
    }
  })

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Guilherme Bezerra <gbsantos.it@gmail.com>',
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
      `<p>Tipo do feddback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`
    ].join('\n')
  })

  return response.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log('🚀 HTTP server running');
});