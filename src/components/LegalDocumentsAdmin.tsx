import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Upload, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DOCUMENTS = [
  { slug: "mentions-legales", label: "Mentions légales" },
  { slug: "cgv", label: "Conditions Générales de Vente" },
  { slug: "politique-de-confidentialite", label: "Politique de confidentialité" },
];

export const LegalDocumentsAdmin = () => {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase
        .from("legal_documents")
        .select("slug, content");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => (map[d.slug] = d.content));
        setContents(map);
      }
    };
    fetchDocs();
    checkExistingPdf();
  }, []);

  const checkExistingPdf = async () => {
    const { data } = await supabase.storage
      .from(BUCKET)
      .list("", { search: PRIVACY_PDF_PATH });
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(PRIVACY_PDF_PATH);
      setPdfUrl(urlData.publicUrl);
    }
  };

  const handleSave = async (slug: string) => {
    setSaving(slug);
    const { error } = await supabase
      .from("legal_documents")
      .update({ content: contents[slug] || "" })
      .eq("slug", slug);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } else {
      toast.success("Document sauvegardé avec succès");
    }
    setSaving(null);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }
    setUploading(true);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(PRIVACY_PDF_PATH, file, { upsert: true });

    if (error) {
      toast.error("Erreur lors de l'upload");
      console.error(error);
    } else {
      toast.success("PDF uploadé avec succès");
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(PRIVACY_PDF_PATH);
      setPdfUrl(urlData.publicUrl);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePdfDelete = async () => {
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([PRIVACY_PDF_PATH]);
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("PDF supprimé");
      setPdfUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Documents légaux</h3>
      <div className="space-y-6">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.slug}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{doc.label}</span>
            </div>

            <Textarea
              value={contents[doc.slug] || ""}
              onChange={(e) =>
                setContents((prev) => ({ ...prev, [doc.slug]: e.target.value }))
              }
              placeholder={`Collez ici le texte de vos ${doc.label}…`}
              className="min-h-[200px] text-sm leading-relaxed"
            />

            <Button
              onClick={() => handleSave(doc.slug)}
              disabled={saving === doc.slug}
              size="sm"
            >
              <Save className="w-4 h-4" />
              {saving === doc.slug ? "Sauvegarde…" : "Enregistrer"}
            </Button>
          </div>
        ))}

        {/* Privacy Policy PDF Upload */}
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Politique de confidentialité (PDF)</span>
          </div>

          {pdfUrl ? (
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Voir le PDF actuel
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Upload…" : "Remplacer"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handlePdfDelete}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Upload en cours…" : "Uploader un PDF"}
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfUpload}
          />
        </div>
      </div>
    </div>
  );
};
