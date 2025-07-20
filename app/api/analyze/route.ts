export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
const filePath = path.join(process.cwd(), "audits.json");

function safeReadAudits(file: string) {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8").trim();
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    fs.renameSync(file, file + ".broken");
    return [];
  }



}
function monthFr(date = new Date()) {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}
  function lastReportMarkdown(audits: any[], url: string) {
  const previous = audits.find(a => a.website_url === url);
  return previous?.markdown ?? "";
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const client_name = form.get("client_name") as string;
  const website_url = form.get("website_url") as string;
  const files = form.getAll("files") as File[];
  const audits = safeReadAudits(filePath);
  const lastMd  = lastReportMarkdown(audits, website_url);

  const moisActuel = monthFr();
  let prompt = `# Contexte
Client: **${client_name}**
Site: **${website_url}**
Mois en cours: **${moisActuel}**

## Règle de comparaison
Voici le **rapport du mois précédent** (Markdown) :

<<<RAPPORT_MOIS_N-1>>>
${lastMd || "_Aucun rapport précédent (mois #1)_"}

---

Analyse aussi les **exports CSV** ci‑dessous pour le mois actuel.
Produis un **rapport Markdown** qui :

* Suit EXACTEMENT la structure PPT (page de garde, sommaire, chapitres 1‑7, annexes).  
* Inclut dans chaque section un **tableau “Avant / Après”** quand c’est pertinent (ex. scores Lighthouse, % 4xx).  
* Affiche les évolutions avec flèches et %.  
* Met en surbrillance les évolutions majeures (> 5 %) avec **gras** et emoji 🔼 / 🔽.  
* Termine par une **synthèse** de 5 puces « Progrès majeurs ce mois‑ci

---

Réponds UNIQUEMENT avec ce Markdown — pas de balises \`\`\`json.

---

## Exports CSV du mois
`;

  for (const f of files) {
    let txt = Buffer.from(await f.arrayBuffer()).toString("utf-8");
    if (txt.length > 32_000) txt = txt.slice(0, 32_000) + "\n…(tronqué)…";
    prompt += `\n### ${f.name}\n\`\`\`csv\n${txt}\n\`\`\``;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.4,
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert SEO senior. Réponds en Markdown pur – pas de balises ```json```.",
      },
      { role: "user", content: prompt },
    ],
  });
  const markdown = choices[0].message.content!.trim();

  const record = {
    audit_id: crypto.randomUUID(),
    client_name,
    website_url,
    analysis_date: new Date().toISOString(),
    markdown,
  };
  
  audits.unshift(record);
  const tmp = filePath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(audits, null, 2), "utf-8");
  fs.renameSync(tmp, filePath);

  return NextResponse.json({ success: true, payload: markdown });
}
