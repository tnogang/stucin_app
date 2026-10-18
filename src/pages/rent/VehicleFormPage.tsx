import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import type { RentVehicle, VehicleStatus } from '@/types/rent';

const emptyForm: Omit<RentVehicle, 'id' | 'createdAt' | 'updatedAt'> = {
  make: '',
  model: '',
  licensePlate: '',
  currentKm: 0,
  status: 'available',
};

export default function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, createVehicle, updateVehicle, loading } = useVehicles();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const existing = vehicles.find((v) => v.id === id);
      if (existing) {
        setForm({
          make: existing.make,
          model: existing.model,
          type: existing.type,
          year: existing.year,
          licensePlate: existing.licensePlate,
          vin: existing.vin,
          color: existing.color,
          registrationExpiry: existing.registrationExpiry,
          currentKm: existing.currentKm,
          status: existing.status,
          notes: existing.notes,
        });
      }
    }
  }, [id, vehicles]);

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.make.trim()) next.make = 'Vnesi znamko';
    if (!form.model.trim()) next.model = 'Vnesi model';
    if (!form.licensePlate.trim()) next.licensePlate = 'Vnesi registrsko tablico';
    if (form.currentKm < 0) next.currentKm = 'Kilometrina ne more biti negativna';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (id) {
        await updateVehicle(id, form);
      } else {
        await createVehicle(form);
      }
      navigate('/rent/vozila');
    } catch (err) {
      console.error(err);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? (err as Error).message
          : String(err);
      const details =
        err && typeof err === 'object' && 'details' in err
          ? String((err as { details: unknown }).details)
          : '';
      setErrors({
        submit: details
          ? `Napaka pri shranjevanju: ${message} (${details})`
          : `Napaka pri shranjevanju: ${message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rent/vozila')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-display font-bold">{isEdit ? 'Uredi vozilo' : 'Novo vozilo'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Osnovni podatki</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Znamka *</Label>
              <Input
                id="make"
                value={form.make}
                onChange={(e) => updateField('make', e.target.value)}
                placeholder="npr. Volkswagen"
              />
              {errors.make && <p className="text-xs text-destructive">{errors.make}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                placeholder="npr. Golf"
              />
              {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tip vozila</Label>
              <Input
                id="type"
                value={form.type ?? ''}
                onChange={(e) => updateField('type', e.target.value)}
                placeholder="npr. kombi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">Registrska tablica *</Label>
              <Input
                id="licensePlate"
                value={form.licensePlate}
                onChange={(e) => updateField('licensePlate', e.target.value.toUpperCase())}
                placeholder="npr. LJ-123-AB"
              />
              {errors.licensePlate && <p className="text-xs text-destructive">{errors.licensePlate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Letnik</Label>
              <NumberInput
                id="year"
                min={1900}
                max={2100}
                value={form.year}
                onChange={(value) => updateField('year', value)}
                placeholder="npr. 2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={form.vin ?? ''}
                onChange={(e) => updateField('vin', e.target.value)}
                placeholder="npr. WVWZZZ..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Barva</Label>
              <Input
                id="color"
                value={form.color ?? ''}
                onChange={(e) => updateField('color', e.target.value)}
                placeholder="npr. siva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationExpiry">Datum poteka registracije</Label>
              <Input
                id="registrationExpiry"
                type="date"
                value={form.registrationExpiry ?? ''}
                onChange={(e) => updateField('registrationExpiry', e.target.value || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentKm">Trenutna kilometrina *</Label>
              <NumberInput
                id="currentKm"
                min={0}
                value={form.currentKm}
                onChange={(value) => updateField('currentKm', value ?? 0)}
              />
              {errors.currentKm && <p className="text-xs text-destructive">{errors.currentKm}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => updateField('status', value as VehicleStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Izberi status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Na voljo</SelectItem>
                  <SelectItem value="rented">Izposojeno</SelectItem>
                  <SelectItem value="maintenance">Servis</SelectItem>
                  <SelectItem value="retired">Upokojeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Opombe</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.notes ?? ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Dodatne opombe o vozilu..."
              rows={4}
            />
          </CardContent>
        </Card>

        {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

        <div className="flex gap-3">
          <Button type="submit" className="btn-emergency" disabled={saving || loading}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Shranjevanje...' : 'Shrani vozilo'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/rent/vozila')}>
            Prekliči
          </Button>
        </div>
      </form>
    </div>
  );
}
