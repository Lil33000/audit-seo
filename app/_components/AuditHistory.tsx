"use client";
import React from "react";

import { formatDate } from "../../lib/utils";
import { Audit } from "../../type/audit";


interface AuditHistoryProps {
  audits: Audit[];
  formatDate: typeof formatDate;
}

export default function AuditHistory({ audits, formatDate }: AuditHistoryProps) {
  if (audits.length === 0) return <p className="text-gray-500 text-center py-8">Aucun audit n&apos;a été effectué pour le moment.</p>;
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des audits</h2>
      <div className="space-y-4">
        {audits.map((audit, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                        <a
  href={`/api/audits/${audit.audit_id}`}
  download={`rapport_${audit.website_url.replace(/^https?:\/\/\//, "")}.md`}
  className="mt-3 inline-block text-sm text-indigo-600 underline hover:text-indigo-800"
>
  Télécharger le rapport
</a>
                        <div className="mt-2 flex items-center space-x-4">
                         
                         
{audit.competitor_urls?.length > 0 && (
  <span className="text-sm text-gray-600">
    Concurrents:{" "}
    <span className="font-medium">{audit.competitor_urls.length}</span>
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
    </div>
  );
}
