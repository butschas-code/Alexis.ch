"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import {
  deleteMediaAsset,
  listMediaForAdmin,
  uploadMediaFile,
  type MediaKind,
  type MediaListItem,
} from "@/cms/services/media-client";
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackError,
  adminFeedbackInfo,
  adminInput,
  adminPanel,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

const kindLabels: Record<MediaKind | "all", string> = {
  all: "Alle Herkünfte",
  hero: "Hero / Titelbild",
  body: "Im Beitragstext",
  general: "Bibliothek",
  submission: "Formulare / Briefe",
};

const mimeLabels = {
  all: "Alle Dateitypen",
  image: "Nur Bilder",
  document: "Dokumente (PDF & Co.)",
} as const;

type MimeFilter = keyof typeof mimeLabels;

type UploadRow = { id: string; name: string; percent: number; error?: string };

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function AdminMediaClient() {
  const [items, setItems] = useState<MediaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<MediaKind | "all">("all");
  const [mimeFilter, setMimeFilter] = useState<MimeFilter>("all");
  const [uploadKind, setUploadKind] = useState<MediaKind>("general");
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listMediaForAdmin({ kind: kindFilter, max: 200 });
      setItems(rows);
    } catch {
      setError("Medien konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [kindFilter]);

  useEffect(() => {
    queueMicrotask(() => {
      void reload();
    });
  }, [reload]);

  const visible = useMemo(() => {
    return items.filter((it) => {
      if (mimeFilter === "image") return it.mimeType.startsWith("image/");
      if (mimeFilter === "document") return !it.mimeType.startsWith("image/");
      return true;
    });
  }, [items, mimeFilter]);

  async function onPickFiles(files: FileList | null) {
    if (!files?.length) return;
    setBanner(null);
    for (const file of Array.from(files)) {
      const id = `${crypto.randomUUID()}`;
      setUploadRows((rows) => [...rows, { id, name: file.name, percent: 0 }]);
      try {
        await uploadMediaFile(file, {
          kind: uploadKind,
          onProgress: (percent) => {
            setUploadRows((rows) => rows.map((r) => (r.id === id ? { ...r, percent } : r)));
          },
        });
        setUploadRows((rows) => rows.filter((r) => r.id !== id));
        await reload();
        setBanner(`«${file.name}» wurde hochgeladen.`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload fehlgeschlagen.";
        setUploadRows((rows) => rows.map((r) => (r.id === id ? { ...r, error: msg } : r)));
      }
    }
  }

  async function copyUrl(url: string, docId: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(docId);
      window.setTimeout(() => setCopiedId((c) => (c === docId ? null : c)), 2000);
    } catch {
      setBanner("Zwischenablage nicht verfügbar — URL manuell kopieren.");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setBanner(null);
    try {
      await deleteMediaAsset(deleteId);
      setDeleteId(null);
      await reload();
      setBanner("Datei entfernt.");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Medien"
        description="Bilder und Dokumente für die Website. Titelbilder aus Beiträgen erscheinen automatisch — hier laden Sie Ergänzungen für die Bibliothek."
        actions={
          <Link href={CMS_PATHS.adminPostNew} className={`${adminBtnSecondary} !px-4 text-[13px]`}>
            Neuer Beitrag
          </Link>
        }
      />

      <AdminPageSection className="space-y-6">
        {banner ? <div className={adminFeedbackInfo}>{banner}</div> : null}

        {error ? <div className={adminFeedbackError}>{error}</div> : null}

        <div className={`${adminPanel} p-6 sm:p-7`}>
          <h2 className="font-serif text-[1.2rem] font-medium text-[var(--apple-text)]">Hochladen</h2>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
            Bilder und übliche Dokumente (z.&nbsp;B. PDF). Speicherort:{" "}
            <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-[12px]">cms/media/…</code>
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-5">
            <label className="block min-w-[220px]">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">
                Kategorie beim Upload
              </span>
              <select
                className={`${adminInput} bg-[var(--apple-bg-subtle)]`}
                value={uploadKind}
                onChange={(e) => setUploadKind(e.target.value as MediaKind)}
              >
                <option value="general">Bibliothek (allgemein)</option>
                <option value="hero">Hero / Titelbild (manuell)</option>
                <option value="body">Beitragstext (manuell)</option>
                <option value="submission">Formular / Brief (Search & Co.)</option>
              </select>
            </label>
            <div
              className="flex min-h-[132px] min-w-[min(100%,300px)] flex-1 flex-col items-center justify-center rounded-[1rem] border-2 border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_85%,white)] px-4 py-7 text-center transition hover:border-[var(--brand-900)]/28 hover:bg-white"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void onPickFiles(e.dataTransfer.files);
              }}
            >
              <span className="text-[15px] font-medium text-[var(--apple-text)]">Dateien auswählen oder hierher ziehen</span>
              <span className="mt-1.5 text-[13px] text-[var(--apple-text-secondary)]">Mehrere Dateien möglich</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 ${adminBtnPrimary} !min-h-[38px] !px-5 !text-[12px]`}
              >
                Dateien wählen…
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void onPickFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {uploadRows.length > 0 ? (
            <ul className="mt-4 space-y-2 border-t border-black/[0.06] pt-4">
              {uploadRows.map((row) => (
                <li key={row.id} className="rounded-lg bg-[var(--apple-bg-subtle)] px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-[var(--apple-text)]">{row.name}</span>
                    {row.error ? <span className="shrink-0 text-xs text-red-600">{row.error}</span> : <span className="text-xs text-[var(--apple-text-secondary)]">{row.percent}%</span>}
                  </div>
                  {!row.error ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.08]">
                      <div
                        className="h-full rounded-full bg-[var(--brand-900)] transition-[width] duration-150"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-[15px] text-[var(--apple-text-secondary)]">
            <span className="mr-2 font-medium text-[var(--apple-text)]">Herkunft</span>
            <select
              className={`${adminInput} !inline-block !w-auto min-w-[10rem] py-2 text-[14px]`}
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as MediaKind | "all")}
            >
              {(Object.keys(kindLabels) as (MediaKind | "all")[]).map((k) => (
                <option key={k} value={k}>
                  {kindLabels[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[15px] text-[var(--apple-text-secondary)]">
            <span className="mr-2 font-medium text-[var(--apple-text)]">Typ</span>
            <select
              className={`${adminInput} !inline-block !w-auto min-w-[9rem] py-2 text-[14px]`}
              value={mimeFilter}
              onChange={(e) => setMimeFilter(e.target.value as MimeFilter)}
            >
              {(Object.keys(mimeLabels) as MimeFilter[]).map((k) => (
                <option key={k} value={k}>
                  {mimeLabels[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <AdminLoading message="Medien werden geladen…" />
        ) : visible.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Medien"
            description="Laden Sie Dateien oben hoch, oder speichern Sie ein Hero-Bild / Text-Bild in einem Beitrag — dann erscheinen die Einträge hier."
            action={{ label: "Zu den Beiträgen", href: CMS_PATHS.adminPosts }}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((it) => (
              <li
                key={it.id}
                className="flex flex-col overflow-hidden rounded-[1.15rem] border border-black/[0.07] bg-[var(--apple-bg-elevated)] shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-18px_rgba(0,0,0,0.06)]"
              >
                <div className="aspect-[16/10] bg-[var(--apple-bg-subtle)]">
                  {it.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element -- CMS grid thumbs
                    <img src={it.downloadUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--apple-text-tertiary)]">
                      {it.mimeType.split("/").pop() ?? "Datei"}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--apple-text)]">{it.originalFileName}</p>
                  <p className="text-xs text-[var(--apple-text-secondary)]">
                    {kindLabels[it.kind]} · {formatBytes(it.sizeBytes)}
                  </p>
                  <p className="text-xs text-[var(--apple-text-tertiary)]">{formatWhen(it.createdAt)}</p>
                  {it.postId ? (
                    <p className="text-xs">
                      <Link href={CMS_PATHS.adminPostEdit(it.postId)} className="text-[var(--brand-900)] hover:underline">
                        Beitrag {it.postId.slice(0, 8)}…
                      </Link>
                    </p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => void copyUrl(it.downloadUrl, it.id)}
                      className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[var(--apple-text)] hover:border-black/15"
                    >
                      {copiedId === it.id ? "Kopiert" : "URL kopieren"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteId(it.id);
                        setDeleteTitle(it.originalFileName);
                      }}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPageSection>

      {deleteId ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-[#1d1d1f]/30 backdrop-blur-[1px]"
            aria-label="Abbrechen"
            onClick={() => {
              if (!deleting) setDeleteId(null);
            }}
          />
          <div className="relative z-10 w-full max-w-md rounded-[1.25rem] border border-black/[0.07] bg-[var(--apple-bg-elevated)] p-7 shadow-[var(--apple-shadow-lg)]">
            <h2 className="font-serif text-[1.2rem] font-medium text-[var(--apple-text)]">Datei löschen?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
              «{deleteTitle}» wird aus der Bibliothek und aus dem Storage entfernt. Verlinkte Beiträge können fehlende
              Bilder anzeigen.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                className={`${adminBtnSecondary} !min-h-[40px] border-black/[0.08] text-[13px]`}
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void confirmDelete()}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-red-800 px-5 text-[13px] font-medium text-white shadow-sm transition hover:bg-red-900 disabled:opacity-50"
              >
                {deleting ? "Wird gelöscht…" : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminPageContainer>
  );
}
