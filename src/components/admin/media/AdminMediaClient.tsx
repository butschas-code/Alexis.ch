import Link from "next/link";
import { CMS_PATHS } from "@/admin/paths";
import { adminBody, adminBtnSecondary, adminFeedbackInfo, adminPanel, adminSectionLabel } from "@/components/admin/admin-ui";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

/**
 * Hinweise-Seite: keine Medienbibliothek / kein Firebase Storage — Bilder nur per URL im Beitrag oder lokal unter `public/uploads/`.
 */
export function AdminMediaClient() {
  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Medien"
        description="Hier gibt es keine Upload-Funktion. Bilder binden Sie direkt im Beitrag ein — ruhig und nachvollziehbar für die tägliche Arbeit."
      />

      <div className={adminFeedbackInfo} role="note">
        <p className="font-medium text-[var(--apple-text)]">Kurz erklärt</p>
        <p className={`mt-2 ${adminBody}`}>
          Firebase Storage wird in diesem CMS nicht verwendet. Stattdessen nutzen Sie öffentlich erreichbare
          Bild-Adressen (https://…) im Beitragseditor und beim Titelbild.
        </p>
      </div>

      <AdminPageSection>
        <div className={`space-y-6 ${adminPanel} p-6 sm:p-8`}>
          <div>
            <h2 className={adminSectionLabel}>Beiträge</h2>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              <strong className="font-medium text-[var(--apple-text)]">Titelbild:</strong> Im Beitragsformular unter
              «Titelbild URL» die vollständige Web-Adresse des Bildes eintragen — optional mit Alternativtext.
            </p>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              <strong className="font-medium text-[var(--apple-text)]">Bilder im Text:</strong> In der Werkzeugleiste
              des Texteditors auf «Bild (URL)» tippen und die Adresse einfügen. Es wird nichts auf einen separaten
              Speicher hochgeladen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={CMS_PATHS.adminPostNew} className={adminBtnSecondary}>
                Neuer Beitrag
              </Link>
              <Link href={CMS_PATHS.adminPosts} className={adminBtnSecondary}>
                Zur Beitragsliste
              </Link>
            </div>
          </div>

          <hr className="border-black/[0.06]" />

          <div>
            <h2 className={adminSectionLabel}>Eigene Dateien auf der Website (optional)</h2>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              Wenn Ihre Agentur oder IT statische Dateien ins Projekt legt, können diese unter dem Ordner{" "}
              <code className="rounded-md bg-black/[0.05] px-1.5 py-0.5 font-mono text-[13px] text-[var(--apple-text)]">
                public/uploads/
              </code>{" "}
              abgelegt werden. Nach dem nächsten Deployment sind sie unter Adressen wie
            </p>
            <p className="mt-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 font-mono text-[13px] text-[var(--apple-text-secondary)]">
              …/uploads/<span className="text-[var(--apple-text-tertiary)]">beispiel.jpg</span>
            </p>
            <p className={`mt-3 max-w-prose ${adminBody}`}>
              erreichbar — dieselbe Adresse können Sie dann als Bild-URL im Beitrag verwenden.
            </p>
          </div>
        </div>
      </AdminPageSection>
    </AdminPageContainer>
  );
}
