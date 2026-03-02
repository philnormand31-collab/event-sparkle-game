import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { PortfolioImage } from "@/pages/Portfolio";

interface Props {
  images: PortfolioImage[];
  loading: boolean;
}

export const PortfolioGallery = ({ images, loading }: Props) => {
  const [selected, setSelected] = useState<PortfolioImage | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-secondary/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">
          Aucune image pour le moment.
        </p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Connectez-vous en admin pour ajouter des photos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.slice(0, 8).map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(img)}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={img.image_url}
              alt={img.title ?? "Portfolio"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              {img.title && (
                <span className="text-foreground font-display font-semibold text-sm">
                  {img.title}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selected.image_url}
                alt={selected.title ?? "Portfolio"}
                className="w-full h-full object-contain rounded-2xl"
              />
              {selected.title && (
                <p className="text-center text-foreground font-display mt-4">
                  {selected.title}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
