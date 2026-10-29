import { NextResponse } from "next/server";
import { getTokenStats } from "@/lib/market";

export const revalidate = 60;

export async function GET() {
  const stats = await getTokenStats();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
