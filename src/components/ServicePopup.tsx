import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useServiceContent } from "@/hooks/useServiceContent";
import { toast } from "sonner";

interface ServicePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  gradient: string;
  serviceKey: string;
  iconRender?: () => React.ReactNode;
}

export const ServicePopup = ({ open, onOpenChange, title, gradient, serviceKey, iconRender }: ServicePopupProps) => {
  const { isAdmin } = useAuth();
  const { content, loading, saveContent } = useServiceContent(serviceKey);
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setDescription(content.description || "");
      setImagePreview(content.image_url || null);
      setImageFile(null);
    }
  }, [content]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await saveContent(description, imageFile || undefined);
    setSaving(false);
    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Contenu sauvegardé !");
      setImageFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-none w-auto [&>button]:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              className="relative w-[90vw] max-w-[700px] aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl"
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${gradient}`} />

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-secondary/80 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-4 px-8 pt-7 pb-4"
              >
                {iconRender && (
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    {iconRender()}
                  </div>
                )}
                <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
              </motion.div>

              {/* Content */}
              <div className="flex flex-1 gap-6 px-8 pb-8 h-[calc(100%-90px)]">
                {/* Left: Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex-1 flex flex-col"
                >
                  <label className="text-sm font-medium text-muted-foreground mb-2">Description</label>
                  {isAdmin ? (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Décrivez votre événement ici..."
                      className="flex-1 w-full rounded-2xl border border-border/50 bg-secondary/30 p-4 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    />
                  ) : (
                    <div className="flex-1 w-full rounded-2xl border border-border/50 bg-secondary/30 p-4 text-sm text-foreground overflow-auto">
                      {loading ? (
                        <span className="text-muted-foreground">Chargement...</span>
                      ) : description ? (
                        <p className="whitespace-pre-wrap">{description}</p>
                      ) : (
                        <span className="text-muted-foreground/60">Aucune description pour le moment.</span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Right: Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <label className="text-sm font-medium text-muted-foreground mb-2">Photo</label>
                  {isAdmin ? (
                    <label
                      className={`flex-1 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all group ${
                        imagePreview
                          ? "border-accent/30 hover:border-accent/60"
                          : "border-border/50 hover:border-accent/50 bg-secondary/20"
                      }`}
                    >
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover rounded-2xl" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/60 group-hover:text-accent/70 transition-colors">
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                            <ImageIcon className="w-12 h-12" />
                          </motion.div>
                          <span className="text-sm font-medium">Cliquez pour ajouter une photo</span>
                        </div>
                      )}
                    </label>
                  ) : (
                    <div className="flex-1 rounded-2xl border border-border/50 bg-secondary/20 overflow-hidden flex items-center justify-center">
                      {loading ? (
                        <span className="text-muted-foreground text-sm">Chargement...</span>
                      ) : imagePreview ? (
                        <img src={imagePreview} alt="Service" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                          <ImageIcon className="w-12 h-12" />
                          <span className="text-sm">Aucune photo</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Save button for admin */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="absolute bottom-4 right-4 z-20"
                >
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50`}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </motion.div>
              )}

              {/* Decorative shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className={`absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary opacity-10 blur-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
