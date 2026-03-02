import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { PortfolioAdmin } from "@/components/PortfolioAdmin";
import { useAuth } from "@/hooks/useAuth";

export interface PortfolioImage {
  id: string;
  image_url: string;
  title: string | null;
  display_order: number;
}

const Portfolio = () => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchImages = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("portfolio_images")
        .select("id, image_url, title, display_order")
        .order("display_order", { ascending: true });
      if (error) {
        console.error("Error fetching portfolio images:", error);
      }
      setImages(data ?? []);
    } catch (err) {
      console.error("Portfolio fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="section-padding pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Notre <span className="gradient-text-accent">Portfolio</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Découvrez nos réalisations événementielles en images
            </p>
          </div>

          {isAdmin && <PortfolioAdmin images={images} onUpdate={fetchImages} />}

          <PortfolioGallery images={images} loading={loading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
