import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceContent {
  service_key: string;
  description: string;
  image_url: string;
}

export const useServiceContent = (serviceKey: string) => {
  const [content, setContent] = useState<ServiceContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_content")
        .select("service_key, description, image_url")
        .eq("service_key", serviceKey)
        .maybeSingle();
      if (error) {
        console.error("Error fetching service content:", error);
      } else if (data) {
        setContent(data as ServiceContent);
      }
    } catch (err) {
      console.error("Unexpected error fetching service content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [serviceKey]);

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
    }
    return { error };
  };

  return { content, loading, saveContent, refetch: fetchContent };
};
