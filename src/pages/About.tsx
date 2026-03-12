import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { AboutAdmin } from "@/components/AboutAdmin";

const About = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentSide, setContentSide] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("about_page")
      .select("*")
      .limit(1)
      .single();
    if (data) {
      setTitle((data as any).title || "");
      setContent(data.content);
      setContentSide((data as any).content_side || "");
      setImageUrl(data.image_url);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-accent">À</span> propos
          </h1>

          {/* Admin editor */}
          {!authLoading && isAdmin && (
            <div className="mb-12 glass-card rounded-2xl p-6 border border-accent/30">
              <AboutAdmin onSaved={fetchData} />
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : (
            <>
              {/* Title - full width above photo */}
              {title && (
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-foreground">
                  {title}
                </h2>
              )}

              {/* Side-by-side: text left, photo right */}
              {(contentSide || imageUrl) && (
                <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
                  {contentSide && (
                    <div className="flex-1 prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {contentSide}
                    </div>
                  )}
                  {imageUrl && (
                    <div className="w-full md:w-80 lg:w-96 flex-shrink-0 rounded-2xl overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="À propos de LUDIGAMI"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Full-width text below */}
              {content ? (
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              ) : (
                !isAdmin && !contentSide && (
                  <p className="text-muted-foreground italic">
                    Contenu à venir...
                  </p>
                )
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
