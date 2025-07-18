"use server";
import fs from "node:fs/promises";
import path from "node:path";
import { Audit } from "../schema/audit";

const DATA_DIR = path.resolve(process.cwd(), "data");
const AUDITS_JSON_PATH = path.join(DATA_DIR, "audits.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    throw new Error("Erreur");
  }
}

export async function readAudits(): Promise<Audit[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(AUDITS_JSON_PATH, "utf-8");
    return JSON.parse(raw) as Audit[];
  } catch {
    return [];
  }
}

export async function saveAudit(audit: Audit): Promise<void> {
  await ensureDataDir();
  const audits = await readAudits();
  audits.unshift(audit); 
  await fs.writeFile(AUDITS_JSON_PATH, JSON.stringify(audits, null, 2), "utf-8");
}