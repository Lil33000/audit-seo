
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "audits.json");

export async function GET() {
  let audits = [];
  try {
    if (fs.existsSync(filePath)) {
      audits = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    audits = [];
  }
  return NextResponse.json(audits);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let audits = [];
  try {
    if (fs.existsSync(filePath)) {
      audits = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    audits = [];
  }

  audits.unshift(body);

  fs.writeFileSync(filePath, JSON.stringify(audits, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}
