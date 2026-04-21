"use client";

type Props = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  working: boolean;
};

export function PostsDeleteDialog({ open, title, onCancel, onConfirm, working }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-[#1d1d1f]/30 backdrop-blur-[1px]"
        aria-label="Dialog schließen"
        onClick={() => {
          if (!working) onCancel();
        }}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[var(--apple-shadow-lg)]">
        <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Beitrag löschen?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--apple-text-secondary)]">
          <span className="font-medium text-[var(--apple-text)]">«{title || "(ohne Titel)"}»</span> wird dauerhaft
          entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={working}
            onClick={onCancel}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[var(--apple-text-secondary)] hover:border-black/15 disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            type="button"
            disabled={working}
            onClick={onConfirm}
            className="rounded-full bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {working ? "Wird gelöscht…" : "Endgültig löschen"}
          </button>
        </div>
      </div>
    </div>
  );
}
