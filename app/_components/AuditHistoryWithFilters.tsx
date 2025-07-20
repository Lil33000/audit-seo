"use client";
import React, { useMemo, useState } from "react";
import AuditHistory from "./AuditHistory";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Audit } from "../../type/audit";

interface AuditHistoryWithFiltersProps {
  audits: Audit[];
}

export default function AuditHistoryWithFilters({
  audits,
}: AuditHistoryWithFiltersProps) {
 
  const [month, setMonth] = useState<string>("all");
  const [company, setCompany] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    audits.forEach((a) => {
      months.add(format(new Date(a.analysis_date), "yyyy-MM", { locale: fr }));
    });
    return Array.from(months).sort().reverse(); 
  }, [audits]);

  const availableCompanies = useMemo(() => {
    const names = new Set(audits.map((a) => a.client_name));
    return Array.from(names).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" })
    );
  }, [audits]);

  const filteredAudits = useMemo(() => {
    let out = audits;

    if (month !== "all") {
      out = out.filter(
        (a) =>
          format(new Date(a.analysis_date), "yyyy-MM") === month
      );
    }

    if (company !== "all") {
      out = out.filter((a) => a.client_name === company);
    }

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      out = out.filter(
        (a) =>
          a.client_name.toLowerCase().includes(s) ||
          a.website_url.toLowerCase().includes(s)
      );
    }

    return out;
  }, [audits, month, company, search]);
  const formatMonthLabel = (key: string) =>
    format(new Date(`${key}-01`), "MMMM yyyy", { locale: fr });

  const resetFilters = () => {
    setMonth("all");
    setCompany("all");
    setSearch("");
  };

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mois
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="all">Tous</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entreprise
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            <option value="all">Toutes</option>
            {availableCompanies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recherche
          </label>
          <input
            type="search"
            placeholder="Nom, URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>

        {(month !== "all" || company !== "all" || search) && (
          <button
            onClick={resetFilters}
            className="ml-auto h-9 px-4 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Réinitialiser
          </button>
        )}
      </div>
      <AuditHistory audits={filteredAudits} formatDate={(date) => format(date, "dd MMMM yyyy", { locale: fr })} />
    </section>
  );
}
