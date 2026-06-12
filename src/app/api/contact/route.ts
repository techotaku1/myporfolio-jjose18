import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as z from 'zod';
import { Env } from '@/libs/Env';

const PORTFOLIO_EMAIL = 'jsdg1818@gmail.com';

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  msg: z.string().trim().min(5),
});

export async function POST(request: Request) {
  if (!Env.PASS_NODEMAILER) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
  }

  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const { name, email, msg } = parsed.data;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: PORTFOLIO_EMAIL,
      pass: Env.PASS_NODEMAILER,
    },
  });

  try {
    await transporter.sendMail({
      from: `Portfolio <${PORTFOLIO_EMAIL}>`,
      to: PORTFOLIO_EMAIL,
      replyTo: email,
      subject: `Nuevo contacto desde el portfolio — ${name}`,
      text: `${msg}\n\n— ${name} (${email})`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }
}
