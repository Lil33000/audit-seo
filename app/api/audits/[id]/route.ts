import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface AuditProps {
  params: Promise<{ id: string }>;
}
const filePath = path.join(process.cwd(), "audits.json");

export async function GET(_req: NextRequest, { params }: AuditProps) {
  const { id } = await params;
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "No history" }, { status: 404 });
  const audits = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const audit = audits.find((a: any) => a.audit_id === id);
  if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(audit.markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="rapport_${audit.website_url.replace(
        /^https?:\/\/\//,
        ""
      )}.md"`,
    },
  });
}
