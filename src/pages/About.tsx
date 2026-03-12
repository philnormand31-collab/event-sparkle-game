import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("about_page")
        .select("content, image_url")
        .limit(1)
        .single();
      if (data) {
        setContent(data.content);
        setImageUrl(data.image_url);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-accent">À</span> propos
          </h1>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : (
            <>
              {imageUrl && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="À propos de LUDIGAMI"
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              {content ? (
                <div
                  className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap"
                >
                  {content}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Contenu à venir...
                </p>
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
