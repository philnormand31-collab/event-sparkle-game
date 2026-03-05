import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DOCUMENTS = [
  { key: "mentions-legales", label: "Mentions légales" },
  { key: "cgv", label: "CGV" },
];

export const LegalDocumentsAdmin = () => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [existingDocs, setExistingDocs] = useState<Record<string, string>>({});

  const fetchExistingDocs = async () => {
    const docs: Record<string, string> = {};
    for (const doc of DOCUMENTS) {
      const { data } = await supabase.storage
        .from("legal-documents")
        .list(doc.key, { limit: 1 });
      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from("legal-documents")
          .getPublicUrl(`${doc.key}/${data[0].name}`);
        docs[doc.key] = urlData.publicUrl;
      }
    }
    setExistingDocs(docs);
  };

  useEffect(() => {
    fetchExistingDocs();
  }, []);

  const handleUpload = async (docKey: string, file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    setUploading(docKey);
    try {
      // Delete existing files in the folder
      const { data: existing } = await supabase.storage
        .from("legal-documents")
        .list(docKey);
      if (existing && existing.length > 0) {
        await supabase.storage
          .from("legal-documents")
          .remove(existing.map((f) => `${docKey}/${f.name}`));
      }

      const path = `${docKey}/${file.name}`;
      const { error } = await supabase.storage
        .from("legal-documents")
        .upload(path, file, { upsert: true });

      if (error) {
        toast.error("Erreur lors du téléchargement");
        console.error(error);
      } else {
        toast.success("Document téléchargé avec succès");
        await fetchExistingDocs();
      }
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (docKey: string) => {
    const { data: existing } = await supabase.storage
      .from("legal-documents")
      .list(docKey);
    if (existing && existing.length > 0) {
      await supabase.storage
        .from("legal-documents")
        .remove(existing.map((f) => `${docKey}/${f.name}`));
      toast.success("Document supprimé");
      await fetchExistingDocs();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Documents légaux</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.key}
            className="rounded-xl border border-border/50 bg-card p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{doc.label}</span>
            </div>

            {existingDocs[doc.key] ? (
              <div className="space-y-2">
                <a
                  href={existingDocs[doc.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  Voir le document actuel
                </a>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(doc.key, file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={uploading === doc.key}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                        {uploading === doc.key ? "Envoi…" : "Remplacer"}
                      </span>
                    </Button>
                  </label>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(doc.key)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <label>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(doc.key, file);
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={uploading === doc.key}
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                    {uploading === doc.key ? "Envoi…" : "Télécharger un PDF"}
                  </span>
                </Button>
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
