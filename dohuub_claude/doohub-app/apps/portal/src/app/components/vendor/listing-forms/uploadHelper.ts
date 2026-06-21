import axios from "axios";
import { toast } from "sonner";
import { supabase } from "../../../../lib/supabase";

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://alishba-x-dohuub-production.up.railway.app"
    : "http://localhost:3001");

/**
 * Open a hidden file picker, upload the chosen image to Supabase Storage via
 * `/api/v1/upload/image`, and return the public URL. Returns null if the user
 * cancels or the upload fails (toast already shown). Shared by every listing
 * form so each one doesn't reinvent the picker.
 */
export async function pickAndUploadListingImage(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    input.onchange = async () => {
      const file = input.files?.[0];
      document.body.removeChild(input);
      if (!file) {
        resolve(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5 MB");
        resolve(null);
        return;
      }
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        const form = new FormData();
        form.append("image", file);
        const resp = await axios.post(
          `${API_BASE}/api/v1/upload/image?type=listing`,
          form,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const url = resp?.data?.data?.url;
        if (!url) {
          toast.error("Upload completed but no URL returned");
          resolve(null);
          return;
        }
        resolve(url);
      } catch (err: any) {
        toast.error(err?.response?.data?.error || err?.message || "Failed to upload image");
        resolve(null);
      }
    };

    input.oncancel = () => {
      document.body.removeChild(input);
      resolve(null);
    };

    document.body.appendChild(input);
    input.click();
  });
}
