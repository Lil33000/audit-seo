
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

export async function POST(req: NextRequest) {
  const form         = await req.formData();
  const client_name  = form.get("client_name")  as string;
  const website_url  = form.get("website_url")  as string;
  const files        = form.getAll("files")     as File[];

  const moisActuel = monthFr();
  let prompt = `# Contexte
Client : **${client_name}**
Site audité : **${website_url}**

Tu es un expert SEO senior.  
Analyse les exports CSV ci‑dessous et rédige un **rapport mensuel en Markdown** calqué sur le template suivant.

---

## Page de garde
*Rapport SEO Mensuel – Client : ${client_name}*  
Mois : ${moisActuel}  
Produit par : **Kapsloc**

## Table des matières
1. Résumé exécutif  
2. KPI globaux (score santé, volume pages, performances)  
3. Problèmes SEO critiques  
4. Balises Title & Meta (qualité + duplication)  
5. Codes réponse HTTP & redirections  
6. Sécurité (headers, mixed content)  
7. Performances web (PageSpeed, CWV)  
8. Priorisation 30 / 60 / 90 jours  
9. Annexes (données brutes)

---

### Détail attendu par section

*Section 3* : tableau « Impact | URL / Fichier | Recommandation ».  
*Section 4* : stats duplication titres + meta, top 10 doublons.  
*Section 5* : % 2xx / 3xx / 4xx / 5xx, liste 404 principales.  
*Section 6* : HTTPS OK ?, HSTS, X‑Frame‑Options, liste de mixed content.  
*Section 7* : tableau LCP / FID / CLS (mobile & desktop).  
*Section 8* : bullet list des actions avec priorité 🔴🟠🟢.

Réponds **uniquement** avec ce Markdown, aucun code block JSON.

---

## Exports CSV à analyser
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
      { role: "system", content: "Tu es un expert SEO senior. Réponds en Markdown pur – pas de balises ```json```." },
      { role: "user",   content: prompt }
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
  const audits = safeReadAudits(filePath);
  audits.unshift(record);
  const tmp = filePath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(audits, null, 2), "utf-8");
  fs.renameSync(tmp, filePath);

  return NextResponse.json({ success: true, payload: markdown });
}
