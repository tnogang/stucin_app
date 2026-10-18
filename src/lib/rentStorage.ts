import { supabase } from '@/lib/supabase';

const BUCKETS = {
  pdfs: 'rental-pdfs',
  signatures: 'rental-signatures',
  photos: 'rental-photos',
} as const;

function dataUrlToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function fileExtFromDataUrl(dataUrl: string): string {
  const mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('png')) return 'png';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  return 'bin';
}

async function uploadDataUrl(
  bucket: string,
  path: string,
  dataUrl: string
): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    upsert: true,
    contentType: blob.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPdf(orderId: string, phase: 'pre' | 'post', dataUrl: string): Promise<string> {
  const path = `${orderId}/${phase}-rental.pdf`;
  return uploadDataUrl(BUCKETS.pdfs, path, dataUrl);
}

export async function uploadSignature(
  orderId: string,
  role: 'customer-out' | 'employee-out' | 'customer-in' | 'employee-in',
  dataUrl: string
): Promise<string> {
  const path = `${orderId}/${role}.${fileExtFromDataUrl(dataUrl)}`;
  return uploadDataUrl(BUCKETS.signatures, path, dataUrl);
}

export async function uploadDamagePhoto(
  orderId: string,
  phase: 'out' | 'in',
  index: number,
  dataUrl: string
): Promise<string> {
  const path = `${orderId}/${phase}-damage-${index}.${fileExtFromDataUrl(dataUrl)}`;
  return uploadDataUrl(BUCKETS.photos, path, dataUrl);
}

export async function deleteRentalFiles(orderId: string): Promise<void> {
  const buckets = [BUCKETS.pdfs, BUCKETS.signatures, BUCKETS.photos];
  for (const bucket of buckets) {
    const { data: files } = await supabase.storage.from(bucket).list(orderId);
    if (files && files.length > 0) {
      const paths = files.map((f) => `${orderId}/${f.name}`);
      await supabase.storage.from(bucket).remove(paths);
    }
  }
}
