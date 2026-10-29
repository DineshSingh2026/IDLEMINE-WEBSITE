import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 422 });
  }
  // TODO(client): forward to the newsletter provider (live config `newsletter.endpoint` is empty).
  console.log(`[subscribe] ${email}`);
  return NextResponse.json({ ok: true });
}
