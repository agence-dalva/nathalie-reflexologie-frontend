"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  getEmailTemplates,
  updateEmailTemplate,
  previewEmailTemplate,
  type EmailTemplate,
  type EmailTemplateType,
} from "@/lib/api";
import { Button } from "@/components/ui/button";

const TYPE_LABELS: Record<EmailTemplateType, string> = {
  CONFIRMATION: "Confirmation de rendez-vous",
  CANCELLATION: "Annulation de rendez-vous",
  MODIFICATION: "Modification de rendez-vous",
};

const VARIABLES = [
  { key: "{{prenom}}", desc: "Prénom du client" },
  { key: "{{nom}}", desc: "Nom du client" },
  { key: "{{prestation}}", desc: "Nom de la prestation" },
  { key: "{{date}}", desc: "Date du rendez-vous" },
  { key: "{{heure}}", desc: "Heure du rendez-vous" },
  { key: "{{prix}}", desc: "Prix de la prestation" },
];

export default function AdminEmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[] | null>(null);
  const [activeType, setActiveType] = useState<EmailTemplateType>("CONFIRMATION");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmailTemplates()
      .then(setTemplates)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Impossible de charger les templates."),
      );
  }, []);

  const active = templates?.find((t) => t.type === activeType) ?? null;

  return (
    <div>
      <h1 className="font-display text-2xl text-sage-800 sm:text-3xl">Emails</h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        Personnalisez le sujet, le titre et le texte des emails envoyés à vos
        clientes. Les couleurs et la mise en forme restent celles du site.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABELS) as EmailTemplateType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setActiveType(type)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeType === type
                ? "bg-sage-600 text-white"
                : "bg-white text-stone-500 hover:bg-sage-50"
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!error && templates === null && (
        <div className="mt-8 h-96 animate-pulse rounded-2xl bg-sage-50" />
      )}

      {active && <TemplateEditor key={active.type} template={active} />}
    </div>
  );
}

function TemplateEditor({ template }: { template: EmailTemplate }) {
  const [subject, setSubject] = useState(template.subject);
  const [title, setTitle] = useState(template.title);
  const [body, setBody] = useState(template.body);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  async function handleSave() {
    setStatus("saving");
    setError(null);
    try {
      await updateEmailTemplate(template.type, { subject, title, body });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'enregistrer.");
      setStatus("idle");
    }
  }

  async function handlePreview() {
    setPreviewLoading(true);
    setError(null);
    try {
      const result = await previewEmailTemplate(template.type, { subject, title, body });
      setPreviewHtml(result.html);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de générer l'aperçu.");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-2">
      <div className="rounded-2xl border border-sage-100 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Objet de l&apos;email
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Titre affiché dans l&apos;email
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-medium text-stone-600">
            Corps du message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none focus:border-sage-500"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {VARIABLES.map((v) => (
            <span
              key={v.key}
              title={v.desc}
              className="rounded-full bg-sage-50 px-2.5 py-1 text-xs font-medium text-sage-600"
            >
              {v.key}
            </span>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={handleSave} disabled={status === "saving"}>
            {status === "saving" ? "Enregistrement…" : status === "saved" ? "Enregistré ✓" : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePreview}
            disabled={previewLoading}
          >
            {previewLoading ? "Génération…" : "Voir l'aperçu"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-sage-100 bg-sage-50 p-6">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          Aperçu
        </p>
        {previewHtml ? (
          <iframe
            title="Aperçu de l'email"
            srcDoc={previewHtml}
            className="mt-4 h-[600px] w-full rounded-xl border border-sage-200 bg-white"
          />
        ) : (
          <div className="mt-4 flex h-[600px] items-center justify-center rounded-xl border border-dashed border-sage-200 text-center text-sm text-stone-400">
            Cliquez sur « Voir l&apos;aperçu » pour visualiser le rendu final
            de l&apos;email avec des données d&apos;exemple.
          </div>
        )}
      </div>
    </div>
  );
}
