"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "./_components/Header";
import AnalyzeForm from "./_components/AnalyzeForm";
import ResultPanel from "./_components/ResultPanel";
import AuditHistory from "./_components/AuditHistory";
import { AnalysisResult, Audit } from "../type/audit";
import { formatDate } from "../lib/utils";



export default function Page() {
  const [formData, setFormData] = useState({
    client_name: "",
    website_url: "",
    competitor_url_1: "",
    competitor_url_2: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [auditHistory, setAuditHistory] = useState<Audit[]>([]);
  const [activeTab, setActiveTab] = useState<"analyze" | "history">("analyze");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/audits");
        if (response.ok) {
          const audits = await response.json();
          setAuditHistory(audits);
        }
      } catch {
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "analyze" ? (
          <AnalyzeForm
            formData={formData}
            setFormData={setFormData}
            files={files}
            setFiles={setFiles}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
            setAnalysisResult={setAnalysisResult}
            resultRef={resultRef}
            reloadHistory={(audits) => setAuditHistory(audits)}
          />
        ) : (
          <AuditHistory audits={auditHistory} formatDate={formatDate} />
        )}

        {activeTab === "analyze" && analysisResult && (
          <ResultPanel
            resultRef={resultRef}
            analysisResult={analysisResult}
            formData={formData}
          />
        )}
      </main>
    </div>
  );
}
