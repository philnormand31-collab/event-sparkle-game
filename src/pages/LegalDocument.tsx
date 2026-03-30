import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

const LegalDocument = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchDoc = async () => {
    if (!slug) return;
    setLoading(true);
    const { data } = await supabase
      .from("legal_documents")
      .select("title, content")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoc();
  }, [slug]);

  const handleEdit = () => {
    setEditContent(content);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    const { error } = await supabase
      .from("legal_documents")
      .update({ content: editContent })
      .eq("slug", slug);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Document sauvegardé !");
      setContent(editContent);
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {title}
              </h1>
              {isAdmin && !editing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[400px] text-sm leading-relaxed"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Sauvegarde…" : "Enregistrer"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : content ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {content}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p>Ce document n'est pas encore disponible.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LegalDocument;
