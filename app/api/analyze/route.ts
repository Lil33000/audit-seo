// app/api/analyze/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

// Chemin absolu (sauvegarde dans le dossier du projet)
const filePath = path.join(process.cwd(), "audits.json");

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const client_name = form.get("client_name") as string;
  const website_url = form.get("website_url") as string;
  const files = form.getAll("files") as File[];

  let prompt = `Client: ${client_name}\nSite: ${website_url}\n\nVoici les exports SEO à analyser :\n\n`;
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let content = Buffer.from(arrayBuffer).toString("utf-8");
    if (content.length > 12000) content = content.slice(0, 12000) + "\n...(tronqué)...";
    prompt += `--- ${file.name} ---\n${content}\n\n`;
  }

  prompt += `
Analyse tous ces fichiers comme un expert SEO.
Génère un rapport SEO **structuré en JSON** :
{
  "resume_executif": "...",
  "score_performance": 0-100,
  "problemes_prioritaires": [
    {
      "categorie": "...",
      "probleme": "...",
      "impact": "Faible/Moyen/Élevé",
      "solution": "..."
    }
  ],
  "recommandations": [
    {
      "priorite": "Haute/Moyenne/Basse",
      "action": "...",
      "delai": "...",
      "ressources": "..."
    }
  ],
  "points_forts": ["..."],
  "axes_amelioration": ["..."]
}
Réponds UNIQUEMENT en JSON.
`;

  // Appel OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Tu es un expert SEO senior. Réponds toujours en JSON strict." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const raw = gptResponse.choices[0].message.content;
  let analysis;
  try {
    analysis = JSON.parse(raw!);
  } catch {
    analysis = { _raw: raw };
  }

  // --- GESTION DE L'HISTORIQUE FICHIER ---
  let audits: any[] = [];
  try {
    if (fs.existsSync(filePath)) {
      audits = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    audits = [];
  }

  const auditRecord = {
    audit_id: crypto.randomUUID(),
    client_name,
    website_url,
    analysis_date: new Date().toISOString(),
    performance_score: analysis?.score_performance || 0,
    files_analyzed: files.map(f => f.name),
    // Ajoute ici les autres champs si besoin
    ...analysis,
  };
  audits.unshift(auditRecord);

  fs.writeFileSync(filePath, JSON.stringify(audits, null, 2), "utf-8");

  return NextResponse.json({
    success: true,
    analysis,
  });
}
