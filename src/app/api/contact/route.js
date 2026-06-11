import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { prenom, nom, courriel, sujet, message } = await req.json();

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "ericbergeron2000@gmail.com",
    subject: sujet || "Nouveau message de contact",
    html: `
      <p><strong>Nom :</strong> ${prenom} ${nom}</p>
      <p><strong>Courriel :</strong> ${courriel}</p>
      <p><strong>Sujet :</strong> ${sujet}</p>
      <p><strong>Message :</strong><br/>${message}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}