import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({ error: "OAuth consent not configured" }, { status: 404 })
}
