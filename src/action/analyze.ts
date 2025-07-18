"use server"
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { analyzeInputSchema, Audit, auditSchema } from "../../src/schema/audit";
import { getOpenAI } from "../../src/lib/openai";
import { saveAudit } from "../../src/lib/storage";




export async function analyze(_: unknown, formData: FormData) {
  const url = formData.get("url");
  const file = formData.get("file");

  const parsedInput = analyzeInputSchema.safeParse({ url, file });
  if (!parsedInput.success) {
    return {
      success: false,
      error: "Invalid input data.",
      issues: parsedInput.error.format(),
    } as const;
  }

  const crawlData = parsedInput.data.file ? await parsedInput.data.file.text() : "";
  const systemPrompt = `You are an expert SEO auditor. Using the crawl data below, create a JSON strictly matching this Zod schema: ${auditSchema.toString()}.`; 
  const userPrompt = `URL to audit: ${parsedInput.data.url}\n\nCrawl data (can be empty):\n${crawlData}`;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  let auditJson: unknown;
  try {
    auditJson = JSON.parse(completion.choices[0].message.content ?? "{}");
  } catch (err) {
    return { success: false, error: "AI response was not valid JSON." } as const;
  }

  const result = auditSchema.safeParse({
    ...(typeof auditJson === "object" && auditJson !== null ? auditJson : {}),
    id: uuidv4(),
    generatedAt: new Date().toISOString(),
    url: parsedInput.data.url,
  });

  if (!result.success) {
    return {
      success: false,
      error: "AI response did not match expected schema.",
      issues: result.error.format(),
    } as const;
  }

  const audit: Audit = result.data;

  await saveAudit(audit);


  return { success: true, audit } as const;
}

export type AnalyzeActionReturn = Awaited<ReturnType<typeof analyze>>;