import { useCallback, useState } from 'react';
import { createWorker } from 'tesseract.js';

const SLO_PLATE_REGEX = /[A-ZČŠŽ]{1,2}\s*[-]?\s*\d{3,4}\s*[-]?\s*[A-ZČŠŽ]{1,2}/i;

export function useLicensePlateOcr() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const recognize = useCallback(async (imageDataUrl: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const ret = await worker.recognize(imageDataUrl);
      await worker.terminate();

      const text = ret.data.text;
      const match = text.match(SLO_PLATE_REGEX);
      if (!match) {
        setError('Tablice niso bile prepoznane. Poskusi ponovno ali vpiši ročno.');
        return null;
      }
      // Normalize: remove spaces and uppercase
      return match[0].replace(/\s/g, '').toUpperCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri OCR.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { recognize, loading, error, progress };
}
