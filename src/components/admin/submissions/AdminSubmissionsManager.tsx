"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import type { CmsSubmissionStatus } from "@/cms/types/enums";
import {
  listSubmissionsForAdmin,
  type SubmissionListItem,
} from "@/cms/services/submissions-admin-client";
import {
  adminFeedbackError,
  adminInput,
  adminPanelInset,
  adminPill,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { SubmissionDetailDrawer } from "./SubmissionDetailDrawer";

const statusLabel: Record<CmsSubmissionStatus, string> = {
  new: "Neu",
  reviewed: "Gelesen",
  archived: "Archiviert",
  spam: "Spam",
};

export function AdminSubmissionsManager() {
  const [rows, setRows] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<CmsSubmissionStatus | "all">("all");
  const [q, setQ] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSubmissionsForAdmin(150);
      setRows(data);
    } catch {
      setError("Einträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        r.type.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s) ||
        (r.summary ?? "").toLowerCase().includes(s) ||
        r.site.toLowerCase().includes(s)
      );
    });
  }, [rows, filterStatus, q]);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Eingänge"
        description="Nachrichten von Kontakt- und Suchauftrag-Formularen. Anhänge liegen sicher im Speicher — hier sehen Sie die Übersicht."
      />

      <AdminPageSection>
        <p className="text-[15px]">
          <Link
            href={CMS_PATHS.adminHome}
            className="font-medium text-[var(--brand-900)] underline decoration-[var(--brand-900)]/20 underline-offset-4 transition hover:decoration-[var(--brand-900)]/45"
          >
            Zur Übersicht
          </Link>
        </p>

        <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${adminPanelInset}`}>
          <label className="block w-full max-w-md flex-1">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Suche</span>
            <input
              type="search"
              placeholder="Typ, Kurzinfo oder ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={adminInput}
            />
          </label>
          <label className="block w-full min-w-[200px] sm:w-52">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as CmsSubmissionStatus | "all")}
              className={adminInput}
            >
            <option value="all">Alle Status</option>
            <option value="new">Neu</option>
            <option value="reviewed">Gelesen</option>
            <option value="archived">Archiviert</option>
            <option value="spam">Spam</option>
          </select>
          </label>
        </div>

        {error ? <div className={adminFeedbackError}>{error}</div> : null}

        {loading ? (
          <div className={`${adminTableWrap} overflow-hidden`}>
            <AdminLoading compact message="Eingänge werden geladen…" />
          </div>
        ) : rows.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Eingänge"
            description="Wenn Besucher ein Formular absenden, erscheint der Eintrag hier — mit allen Angaben und Links zu Anhängen."
          />
        ) : (
          <div className={adminTableWrap}>
            <table className="w-full text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_65%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3.5 pl-5">Typ / Kurzinfo</th>
                  <th className="px-4 py-3.5">Site</th>
                  <th className="hidden px-4 py-3.5 md:table-cell">Zeit</th>
                  <th className="px-4 py-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <p className="font-serif text-[1.1rem] font-medium text-[var(--apple-text)]">Keine Treffer</p>
                      <p className="mt-2 text-[14px] text-[var(--apple-text-secondary)]">
                        Suche oder Statusfilter anpassen.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)]"
                      onClick={() => setDetailId(r.id)}
                    >
                      <td className="px-4 py-3.5 pl-5">
                        <div className="font-medium">{r.type}</div>
                        {r.summary ? (
                          <div className="mt-0.5 text-[13px] text-[var(--apple-text-secondary)]">{r.summary}</div>
                        ) : null}
                        <div className="font-mono text-xs text-[var(--apple-text-tertiary)]">{r.id}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--apple-text-secondary)]">{r.site}</td>
                      <td className="hidden px-4 py-3.5 text-[var(--apple-text-secondary)] md:table-cell">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString("de-CH") : "—"}
                      </td>
                      <td className="px-4 py-3.5 pr-5">
                        <span className={adminPill}>{statusLabel[r.status] ?? r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>

      <SubmissionDetailDrawer
        submissionId={detailId}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        onStatusChanged={() => void load()}
      />
    </AdminPageContainer>
  );
}
