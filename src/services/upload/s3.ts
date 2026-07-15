import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

export type PresignResponse = { id: string; url: string; fields: Record<string, string> };

export async function presignUpload(filename: string, contentType: string): Promise<PresignResponse> {
  const { data } = await apiClient.post<PresignResponse>(ENDPOINTS.MEDIA.PRESIGN, {
    filename,
    content_type: contentType,
  });
  return data;
}

export async function uploadToS3(
  url: string,
  fields: Record<string, string>,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));
    form.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("S3 upload network error"));
    xhr.send(form);
  });
}

export async function confirmUpload(id: string): Promise<void> {
  await apiClient.patch(ENDPOINTS.MEDIA.CONFIRM(id));
}

export async function uploadMedia(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const { id, url, fields } = await presignUpload(file.name, file.type);
  await uploadToS3(url, fields, file, onProgress);
  await confirmUpload(id);
  return id;
}
