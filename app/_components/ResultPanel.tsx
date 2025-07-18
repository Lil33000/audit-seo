"use client";
import React, { useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Head from "next/head";

<Head>
  <style>{`@media print {
    body { margin:0; }
    h2 { page-break-before: always; }
    /* force chaque Section sur page dédiée */
    section { break-inside: avoid; }
  }`}</style>
</Head>

interface Props {
  resultRef: React.RefObject<HTMLDivElement>;
  analysisResult: { success: boolean; payload?: string; error?: string };
  formData: { website_url: string };
}

export default function ResultPanel({ resultRef, analysisResult, formData }: Props) {
  const downloadPdf = useCallback(async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { scrollY: -window.scrollY, scale: 2 });
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const ratio = Math.min(
      pdf.internal.pageSize.getWidth() / canvas.width,
      pdf.internal.pageSize.getHeight() / canvas.height
    );
    pdf.addImage(canvas, "PNG", 0, 0, canvas.width * ratio, canvas.height * ratio);
    pdf.save(`audit_${formData.website_url.replace(/^https?:\/\/\//, "")}.pdf`);
  }, [formData.website_url, resultRef]);

  if (!analysisResult) return null;

  return (
    <div ref={resultRef} className="bg-white rounded-2xl shadow-xl p-8 mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Rapport SEO</h2>

      {analysisResult.success ? (
        <article className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {analysisResult.payload ?? ""}
          </ReactMarkdown>
        </article>
      ) : (
        <p className="text-red-600">{analysisResult.error}</p>
      )}

      <button
        onClick={downloadPdf}
        className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
      >
        Télécharger le PDF
      </button>
    </div>
  );
}
