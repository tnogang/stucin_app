import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileCheck, Camera, X, ImagePlus } from 'lucide-react';
import { generatePostRentalPdf } from '@/lib/pdfGenerator';
import { uploadPdf } from '@/lib/rentStorage';
import CameraCapture from '@/components/rent/CameraCapture';

export default function RentalReturnPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals, updateRental } = useRentals();
  const { vehicles, updateVehicle } = useVehicles();

  const order = rentals.find((r) => r.id === id);
  const vehicle = vehicles.find((v) => v.id === order?.vehicleId);

  const [returnKm, setReturnKm] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState('');
  const [cleanIn, setCleanIn] = useState(true);
  const [damageNotesIn, setDamageNotesIn] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setReturnKm(order.rental.returnKm?.toString() || '');
      setActualReturnDate(
        order.rental.actualReturnDate
          ? new Date(order.rental.actualReturnDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setCleanIn(order.condition.cleanIn ?? true);
      setDamageNotesIn(order.condition.damageNotesIn || '');
      setPhotos(order.condition.damagePhotosIn || []);
    }
  }, [order]);

  useEffect(() => {
    if (order && order.status === 'returned') {
      navigate(`/rent/izposoja/${order.id}`);
    }
  }, [order, navigate]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!actualReturnDate) next.actualReturnDate = 'Vnesi datum in uro vrnitve';
    if (!returnKm.trim()) next.returnKm = 'Vnesi kilometrino ob vrnitvi';
    const km = parseInt(returnKm);
    if (isNaN(km) || km < (order?.rental.startKm ?? 0)) {
      next.returnKm = 'Kilometrina ob vrnitvi mora biti večja od prevzemne';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !vehicle || !id) return;
    if (!validate()) return;

    setSaving(true);
    try {
      const actualReturnDateValue = actualReturnDate
        ? new Date(actualReturnDate).toISOString()
        : new Date().toISOString();
      const km = parseInt(returnKm);

      const updatedCondition = {
        ...order.condition,
        cleanIn,
        damageNotesIn,
        damagePhotosIn: photos,
      };

      const updatedRental = {
        ...order.rental,
        actualReturnDate: actualReturnDateValue,
        returnKm: km,
      };

      const orderUpdate = {
        status: 'returned' as const,
        condition: updatedCondition,
        rental: updatedRental,
      };

      // Generate post-rental PDF
      const postPdf = await generatePostRentalPdf(
        { ...order, ...orderUpdate },
        vehicle
      );
      const postPdfUrl = await uploadPdf(id, 'post', postPdf);

      await updateRental(id, {
        ...orderUpdate,
        documents: { ...order.documents, postRentalPdf: postPdfUrl },
      });

      // Update vehicle km and status
      await updateVehicle(vehicle.id, {
        currentKm: km,
        status: 'available',
      });

      navigate(`/rent/izposoja/${id}`);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err instanceof Error ? err.message : 'Napaka pri zaključevanju.' });
    } finally {
      setSaving(false);
    }
  };

  const compressPhoto = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 1200;
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas ni na voljo'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const compressed = await compressPhoto(dataUrl);
      newPhotos.push(compressed);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (!order || !vehicle) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nalog ni mogoče najti.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/rent/izposoja/${id}`)} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-display font-bold">Vrnitev vozila</h1>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-base">
            {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) – {order.customer.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-base md:text-sm space-y-2">
          <p><span className="text-muted-foreground">Prevzemna kilometrina:</span> {order.rental.startKm.toLocaleString('sl-SI')} km</p>
          <p><span className="text-muted-foreground">Prevzem:</span> {new Date(order.rental.startDate).toLocaleString('sl-SI')}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-base">Stanje ob vrnitvi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label htmlFor="actualReturnDate">Datum in ura dejanske vrnitve *</Label>
              <Input
                id="actualReturnDate"
                type="datetime-local"
                value={actualReturnDate}
                onChange={(e) => setActualReturnDate(e.target.value)}
              />
              {errors.actualReturnDate && <p className="text-xs text-destructive">{errors.actualReturnDate}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="returnKm">Kilometrina ob vrnitvi *</Label>
              <NumberInput
                id="returnKm"
                min={order.rental.startKm}
                value={returnKm === '' ? undefined : Number(returnKm)}
                onChange={(value) => {
                  setReturnKm(value === undefined ? '' : String(value));
                  setErrors((prev) => ({ ...prev, returnKm: '' }));
                }}
                placeholder="npr. 12345"
              />
              {errors.returnKm && <p className="text-xs text-destructive">{errors.returnKm}</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="cleanIn">Vozilo je čisto</Label>
              <Select value={cleanIn ? 'yes' : 'no'} onValueChange={(v) => setCleanIn(v === 'yes')}>
                <SelectTrigger id="cleanIn">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Da</SelectItem>
                  <SelectItem value="no">Ne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="damageNotesIn">Opombe / poškodbe ob vrnitvi</Label>
              <Textarea
                id="damageNotesIn"
                value={damageNotesIn}
                onChange={(e) => setDamageNotesIn(e.target.value)}
                placeholder="Opiši morebitne nove poškodbe ali posebnosti..."
                rows={4}
                className="text-base md:text-sm"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Slike stanja vozila ob vrnitvi</Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={photo} alt={`Slika ${idx + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removePhoto(idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCameraOpen(true)}
                  className="flex-1 min-h-12"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Slikaj
                </Button>
                <Label className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full min-h-12"
                    asChild
                  >
                    <span>
                      <ImagePlus className="w-5 h-5 mr-2 inline" />
                      Izberi slike
                    </span>
                  </Button>
                </Label>
              </div>
            </div>

            {cameraOpen && (
              <CameraCapture
                title="Slika stanja vozila"
                onClose={() => setCameraOpen(false)}
                onCapture={async (dataUrl) => {
                  const compressed = await compressPhoto(dataUrl);
                  setPhotos((prev) => [...prev, compressed]);
                  setCameraOpen(false);
                }}
              />
            )}
          </CardContent>
        </Card>

        {errors.submit && <p className="text-base md:text-sm text-destructive">{errors.submit}</p>}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:static md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none z-50">
          <Button type="submit" className="w-full btn-emergency min-h-12" disabled={saving}>
            <FileCheck className="w-5 h-5 mr-2" />
            {saving ? 'Zaključevanje...' : 'Zaključi vrnitev in ustvari PDF'}
          </Button>
        </div>
      </form>
    </div>
  );
}
