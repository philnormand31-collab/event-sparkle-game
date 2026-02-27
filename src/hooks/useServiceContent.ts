import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceContent {
  service_key: string;
  description: string;
  image_url: string;
}

export const useServiceContent = (serviceKey: string) => {
  const [content, setContent] = useState<ServiceContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("service_content")
        .select("service_key, description, image_url")
        .eq("service_key", serviceKey)
        .abortSignal(controller.signal)
        .maybeSingle();

      if (error) {
        console.error("Error fetching service content:", error);
        setError("Impossible de charger le contenu pour le moment.");
        setContent(null);
      } else {
        setContent(data ? (data as ServiceContent) : null);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.error("Service content fetch timed out");
        setError("Le chargement a pris trop de temps.");
      } else {
        console.error("Unexpected error fetching service content:", err);
        setError("Impossible de charger le contenu pour le moment.");
      }
      setContent(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [serviceKey]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  const saveContent = async (description: string, imageFile?: File) => {
    let image_url = content?.image_url || "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${serviceKey}/photo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(path, imageFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("service-images")
          .getPublicUrl(path);
        image_url = urlData.publicUrl + "?t=" + Date.now();
      }
    }

    const { error } = await supabase
      .from("service_content")
      .update({ description, image_url })
      .eq("service_key", serviceKey);

    if (!error) {
      setContent({ service_key: serviceKey, description, image_url });
      setError(null);
    }
    return { error };
  };

  return { content, loading, error, saveContent, refetch: fetchContent };
};
