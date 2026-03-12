import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Upload, Trash2, Loader2 } from "lucide-react";

export const AboutAdmin = ({ onSaved }: { onSaved?: () => void }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("about_page")
        .select("*")
        .limit(1)
        .single();
      if (data) {
        setContent(data.content);
        setImageUrl(data.image_url);
        setRowId(data.id);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!rowId) return;
    setSaving(true);
    const { error } = await supabase
      .from("about_page")
      .update({ content, image_url: imageUrl })
      .eq("id", rowId);
    setSaving(false);
    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } else {
      toast.success("Page À propos mise à jour !");
      onSaved?.();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `about-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("about-images")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Erreur lors de l'upload");
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("about-images")
      .getPublicUrl(fileName);

    setImageUrl(urlData.publicUrl);
    setUploading(false);
    toast.success("Image uploadée !");
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">Page À propos</h2>

      {/* Image */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Photo</label>
        {imageUrl ? (
          <div className="relative group">
            <img
              src={imageUrl}
              alt="À propos"
              className="w-full max-h-64 object-cover rounded-xl"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent transition-colors">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Cliquez pour ajouter une photo
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Contenu</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez le texte de votre page À propos..."
          rows={12}
          className="resize-y"
        />
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </Button>
    </div>
  );
};
