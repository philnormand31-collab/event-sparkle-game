import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";

const DOCUMENTS = [
  { slug: "mentions-legales", label: "Mentions légales" },
  { slug: "cgv", label: "Conditions Générales de Vente" },
];

export const LegalDocumentsAdmin = () => {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

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
  }, []);

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
      </div>
    </div>
  );
};
