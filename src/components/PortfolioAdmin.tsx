import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2, Loader2 } from "lucide-react";
import type { PortfolioImage } from "@/pages/Portfolio";

interface Props {
  images: PortfolioImage[];
  onUpdate: () => void;
}

export const PortfolioAdmin = ({ images, onUpdate }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Sélectionnez une image");
    if (images.length >= 8) return toast.error("Maximum 8 images atteint");

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from("portfolio-images")
      .upload(path, file);

    if (storageError) {
      setUploading(false);
      return toast.error("Erreur upload : " + storageError.message);
    }

    const { data: urlData } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(path);

    const { error: dbError } = await supabase.from("portfolio_images").insert({
      image_url: urlData.publicUrl,
      title: title || null,
      display_order: images.length,
    });

    setUploading(false);
    if (dbError) return toast.error("Erreur DB : " + dbError.message);

    toast.success("Image ajoutée !");
    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    onUpdate();
  };

  const handleDelete = async (img: PortfolioImage) => {
    const fileName = img.image_url.split("/").pop();
    if (fileName) {
      await supabase.storage.from("portfolio-images").remove([fileName]);
    }
    await supabase.from("portfolio_images").delete().eq("id", img.id);
    toast.success("Image supprimée");
    onUpdate();
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-12 space-y-4">
      <h3 className="font-display font-semibold text-lg text-foreground">
        Gestion du portfolio
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="flex-1"
        />
        <Input
          placeholder="Titre (optionnel)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Ajouter
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img
                src={img.image_url}
                alt={img.title ?? ""}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(img)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length}/8 images
      </p>
    </div>
  );
};
