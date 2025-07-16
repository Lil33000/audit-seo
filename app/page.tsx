"use client";
import React, { useState, useEffect } from "react";

const backendUrl = ""

const getImpactColor = (impact?: string) => {
  switch (impact?.toLowerCase()) {
    case "élevé": case "high": return "text-red-600 bg-red-50";
    case "moyen": case "medium": return "text-yellow-600 bg-yellow-50";
    case "faible": case "low": return "text-green-600 bg-green-50";
    default: return "text-gray-600 bg-gray-50";
  }
};
const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "haute": case "high": return "text-red-600 bg-red-50";
    case "moyenne": case "medium": return "text-yellow-600 bg-yellow-50";
    case "basse": case "low": return "text-green-600 bg-green-50";
    default: return "text-gray-600 bg-gray-50";
  }
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function Home() {
  const [formData, setFormData] = useState({
    client_name: "",
    website_url: "",
    competitor_url_1: "",
    competitor_url_2: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => { loadAuditHistory(); }, []);

  const loadAuditHistory = async () => {
    try {
      const response = await fetch("/api/audits");
      if (response.ok) {
        const audits = await response.json();
        setAuditHistory(audits);
      }
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("client_name", formData.client_name);
      formDataToSend.append("website_url", formData.website_url);
      formDataToSend.append("competitor_url_1", formData.competitor_url_1);
      formDataToSend.append("competitor_url_2", formData.competitor_url_2);
      files.forEach((file) => formDataToSend.append("files", file));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
        loadAuditHistory();
      } else {
        const error = await response.json();
        setAnalysisResult({ success: false, error: error.detail || "Erreur lors de l'analyse" });
      }
    } catch (error: any) {
      setAnalysisResult({ success: false, error: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Kapsloc SEO Audit</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("analyze")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "analyze"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Nouvelle Analyse
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Historique
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "analyze" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Analyser un nouveau site
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du client
                    </label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Nom du client"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL du site web
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Analyse concurrentielle (optionnel)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ajoutez jusqu'à 2 sites concurrents pour une analyse comparative automatique
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concurrent 1
                      </label>
                      <input
                        type="url"
                        name="competitor_url_1"
                        value={formData.competitor_url_1}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://concurrent1.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concurrent 2
                      </label>
                      <input
                        type="url"
                        name="competitor_url_2"
                        value={formData.competitor_url_2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://concurrent2.com"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichiers d'audit SEO
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Télécharger des fichiers</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".csv,.txt,.json,.xml"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV, TXT, JSON, XML jusqu'à 10MB</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Fichiers sélectionnés:
                      </h4>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Analyse en cours...
                    </div>
                  ) : (
                    "Lancer l'analyse SEO"
                  )}
                </button>
              </form>
            </div>
            {analysisResult && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Résultats de l'analyse
                </h2>
                {analysisResult.success ? (
                  <div className="space-y-8">
                    <div className={`p-4 rounded-lg flex items-center ${
                      analysisResult.analysis.score_performance < 50
                        ? "bg-red-50"
                        : analysisResult.analysis.score_performance < 80
                        ? "bg-yellow-50"
                        : "bg-green-50"
                    }`}>
                      <span className="text-4xl font-bold text-indigo-700 mr-6">
                        {analysisResult.analysis.score_performance ?? 0}/100
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">Score de Performance</div>
                        <div className="w-full h-3 rounded-full bg-gray-200 mt-2">
                          <div
                            className="h-3 rounded-full bg-indigo-600 transition-all duration-300"
                            style={{
                              width: `${analysisResult.analysis.score_performance ?? 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Résumé Exécutif
                      </h3>
                      <p className="text-gray-700">
                        {analysisResult.analysis.resume_executif || "Résumé non disponible."}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Problèmes prioritaires
                      </h3>
                      <ul className="space-y-2">
                        {Array.isArray(analysisResult.analysis.problemes_prioritaires) &&
                          analysisResult.analysis.problemes_prioritaires.map(
                            (issue: any, idx: number) => (
                              <li key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-1">
                                  <span
                                    className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(issue.impact)}`}
                                  >
                                    {issue.impact}
                                  </span>
                                  <span className="font-semibold">{issue.categorie}</span>
                                </div>
                                <div className="font-medium">{issue.probleme}</div>
                                <div className="text-xs text-gray-700">{issue.solution}</div>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recommandations
                      </h3>
                      <ul className="space-y-2">
                        {Array.isArray(analysisResult.analysis.recommandations) &&
                          analysisResult.analysis.recommandations.map(
                            (rec: any, idx: number) => (
                              <li key={idx} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-1">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priorite)}`}
                                  >
                                    {rec.priorite}
                                  </span>
                                  <span className="ml-2 text-sm text-gray-500">{rec.delai}</span>
                                </div>
                                <div className="font-medium">{rec.action}</div>
                                <div className="text-xs text-gray-700">{rec.ressources}</div>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Points forts</h4>
                        <ul className="flex flex-wrap gap-2">
                          {Array.isArray(analysisResult.analysis.points_forts) &&
                            analysisResult.analysis.points_forts.map(
                              (pt: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
                                >
                                  {pt}
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Axes d'amélioration</h4>
                        <ul className="flex flex-wrap gap-2">
                          {Array.isArray(analysisResult.analysis.axes_amelioration) &&
                            analysisResult.analysis.axes_amelioration.map(
                              (axe: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs"
                                >
                                  {axe}
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Erreur d'analyse
                    </h3>
                    <p className="text-red-700">{analysisResult.error}</p>
                  </div>
                )}
                {analysisResult?.analysis && (
                  <button
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
                    onClick={() => {
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(analysisResult.analysis, null, 2));
                      const downloadAnchorNode = document.createElement("a");
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute(
                        "download",
                        `audit_${formData.website_url.replace(/^https?:\/\//, "")}.json`
                      );
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                  >
                    Télécharger le rapport JSON
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Historique des audits
            </h2>
            {auditHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun audit n'a été effectué pour le moment.
              </p>
            ) : (
              <div className="space-y-4">
                {auditHistory.map((audit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {audit.client_name}
                        </h3>
                        <p className="text-indigo-600 hover:text-indigo-800">
                          {audit.website_url}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Analysé le {formatDate(audit.analysis_date)}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Score:{" "}
                            <span className="font-medium">
                              {audit.performance_score}/100
                            </span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Fichiers:{" "}
                            <span className="font-medium">
                              {audit.files_analyzed.length}
                            </span>
                          </span>
                          {audit.competitor_urls &&
                            audit.competitor_urls.length > 0 && (
                              <span className="text-sm text-gray-600">
                                Concurrents:{" "}
                                <span className="font-medium">
                                  {audit.competitor_urls.length}
                                </span>
                              </span>
                            )}
                        </div>
                        {audit.competitor_urls &&
                          audit.competitor_urls.length > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <svg
                                  className="w-4 h-4 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  />
                                </svg>
                                <span className="text-xs text-purple-600 font-medium">
                                  Analyse concurrentielle effectuée
                                </span>
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-indigo-600">
                          {audit.performance_score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
