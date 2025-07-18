"use client";
import React from "react";

interface HeaderProps {
  activeTab: "analyze" | "history";
  setActiveTab: (tab: "analyze" | "history") => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Kapsloc SEO Audit</h1>
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
  );
}