import { useState } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Sélectionnez une image");
      return;
    }
    if (images.length >= 8) {
      toast.error("Maximum 8 images atteint");
      return;
    }

    setUploading(true);
    try {
      const ext = selectedFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("portfolio-images")
        .upload(path, selectedFile);

      if (storageError) {
        console.error("Storage error:", storageError);
        toast.error("Erreur upload : " + storageError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(path);

      const { error: dbError } = await (supabase as any)
        .from("portfolio_images")
        .insert({
          image_url: urlData.publicUrl,
          title: title || null,
          display_order: images.length,
        });

      if (dbError) {
        console.error("DB error:", dbError);
        toast.error("Erreur DB : " + dbError.message);
        return;
      }

      toast.success("Image ajoutée !");
      setTitle("");
      setSelectedFile(null);
      onUpdate();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Erreur inattendue lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: PortfolioImage) => {
    try {
      const urlParts = img.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1]?.split("?")[0];
      if (fileName) {
        await supabase.storage.from("portfolio-images").remove([fileName]);
      }
      await (supabase as any).from("portfolio_images").delete().eq("id", img.id);
      toast.success("Image supprimée");
      onUpdate();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-12 space-y-4">
      <h3 className="font-display font-semibold text-lg text-foreground">
        Gestion du portfolio
      </h3>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
              <Upload className="w-4 h-4" />
              {selectedFile ? selectedFile.name : "Choisir une image..."}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <Input
            placeholder="Titre (optionnel)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Ajouter
          </Button>
        </div>
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
