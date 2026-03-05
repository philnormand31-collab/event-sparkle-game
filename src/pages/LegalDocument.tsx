import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, FileText } from "lucide-react";

const TITLES: Record<string, string> = {
  "mentions-legales": "Mentions légales",
  "cgv": "Conditions Générales de Vente",
};

const LegalDocument = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase.storage
        .from("legal-documents")
        .list(slug, { limit: 1 });

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from("legal-documents")
          .getPublicUrl(`${slug}/${data[0].name}`);
        setPdfUrl(urlData.publicUrl);
      }
      setLoading(false);
    };
    fetchDoc();
  }, [slug]);

  const title = slug ? TITLES[slug] || slug : "Document";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-display font-bold text-foreground mb-8">
          {title}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : pdfUrl ? (
          <div className="space-y-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ouvrir le document en plein écran
            </a>
            <div className="rounded-xl overflow-hidden border border-border/50 bg-card">
              <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full"
                style={{ height: "80vh" }}
              >
                <p className="p-8 text-center text-muted-foreground">
                  Votre navigateur ne peut pas afficher ce PDF.{" "}
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Cliquez ici pour le télécharger
                  </a>.
                </p>
              </object>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ce document n'est pas encore disponible.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LegalDocument;
