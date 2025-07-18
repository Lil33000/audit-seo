import { z } from "zod";

export const auditSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  generatedAt: z.string().datetime(),
  score: z.number().min(0).max(100),
  summary: z.string().min(1),
  issues: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(["info", "low", "medium", "high", "critical"]),
      description: z.string(),
      recommendation: z.string(),
    })
  ),
});

export type Audit = z.infer<typeof auditSchema>;

export const analyzeInputSchema = z.object({
  url: z.string().url(),
  file: z.instanceof(File).optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;