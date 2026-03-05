import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const LegalDocument = () => {
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchDoc();
  }, [slug]);

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
        ) : content ? (
          <>
            <h1 className="text-3xl font-display font-bold text-foreground mb-8">
              {title}
            </h1>
            <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {content}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Ce document n'est pas encore disponible.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LegalDocument;
