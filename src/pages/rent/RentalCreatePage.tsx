import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '@/hooks/useVehicles';
import { useRentals } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, FileText, ScanLine } from 'lucide-react';
import { generatePreRentalPdf } from '@/lib/pdfGenerator';
import { uploadPdf } from '@/lib/rentStorage';
import CameraCapture from '@/components/rent/CameraCapture';
import { useLicensePlateOcr } from '@/hooks/useLicensePlateOcr';
import type { RentalOrder, RentVehicle } from '@/types/rent';
import { defaultRentalEquipment } from '@/types/rent';

const STEPS = ['Izbira vozila', 'Stranka', 'Pogoji', 'Pregled'];

function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-normal">{label}</Label>
      <RadioGroup
        value={value ? 'yes' : 'no'}
        onValueChange={(v) => onChange(v === 'yes')}
        className="flex items-center gap-6"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="yes" id={`${label}-yes`} className="h-5 w-5" />
          <Label htmlFor={`${label}-yes`} className="text-base font-normal cursor-pointer">Da</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="no" id={`${label}-no`} className="h-5 w-5" />
          <Label htmlFor={`${label}-no`} className="text-base font-normal cursor-pointer">Ne</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default function RentalCreatePage() {
  const navigate = useNavigate();
  const { vehicles, updateVehicle } = useVehicles();
  const { createRental, updateRental } = useRentals();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cameraOpen, setCameraOpen] = useState(false);
  const { recognize, loading: ocrLoading, error: ocrError, progress } = useLicensePlateOcr();

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'available'),
    [vehicles]
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [customer, setCustomer] = useState<RentalOrder['customer']>({
    fullName: '',
    address: '',
    phone: '',
  });
  const [rental, setRental] = useState<Partial<RentalOrder['rental']>>({
    startDate: new Date().toISOString().slice(0, 16),
    expectedReturnDate: '',
    startKm: 0,
    pickupLocation: '',
    returnLocation: '',
    protocolNumber: '',
    personalInsurance: true,
    kaskoInsurance: true,
    delivery: false,
    deliveryWithTow: false,
    deliveryLocation: '',
    pickup: false,
    pickupWithTow: false,
  });
  const [condition, setCondition] = useState<Partial<RentalOrder['condition']>>({
    cleanOut: true,
    damageNotesOut: '',
    equipment: defaultRentalEquipment(),
  });

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [selectedVehicleId, vehicles]
  );

  const updateCustomer = (field: keyof RentalOrder['customer'], value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateRentalField = <K extends keyof RentalOrder['rental']>(field: K, value: RentalOrder['rental'][K]) => {
    setRental((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateEquipment = (field: keyof RentalOrder['condition']['equipment'], value: boolean) => {
    setCondition((prev) => ({
      ...prev,
      equipment: {
        ...defaultRentalEquipment(),
        ...prev.equipment,
        [field]: value,
      },
    }));
  };

  const validateStep = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!selectedVehicleId) next.vehicle = 'Izberi vozilo';
    }
    if (step === 1) {
      if (!customer.fullName.trim()) next.fullName = 'Vnesi ime in priimek';
      if (!customer.address.trim()) next.address = 'Vnesi naslov';
      if (!customer.phone.trim()) next.phone = 'Vnesi telefon';
    }
    if (step === 2) {
      if (!rental.startDate) next.startDate = 'Izberi datum prevzema';
      if ((rental.startKm ?? 0) < 0) next.startKm = 'Neveljavna kilometrina';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!selectedVehicle || !validateStep()) return;

    setSaving(true);
    try {
      const order: Omit<RentalOrder, 'id' | 'createdAt' | 'updatedAt'> = {
        vehicleId: selectedVehicle.id,
        status: 'draft',
        customer,
        rental: {
          startDate: rental.startDate || new Date().toISOString(),
          expectedReturnDate: rental.expectedReturnDate || '',
          startKm: rental.startKm || 0,
          pickupLocation: rental.pickupLocation,
          returnLocation: rental.returnLocation,
          protocolNumber: rental.protocolNumber?.trim() || undefined,
          insurance: true,
          personalInsurance: true,
          kaskoInsurance: true,
          delivery: rental.delivery ?? false,
          deliveryWithTow: rental.deliveryWithTow ?? false,
          deliveryLocation: rental.deliveryLocation,
          pickup: rental.pickup ?? false,
          pickupWithTow: rental.pickupWithTow ?? false,
        },
        condition: {
          cleanOut: condition.cleanOut ?? true,
          damageNotesOut: condition.damageNotesOut || '',
          damagePhotosOut: [],
          equipment: condition.equipment ?? defaultRentalEquipment(),
        },
        signatures: {},
        documents: {},
      };

      const created = await createRental(order);

      // Mark vehicle as rented and update current km to pickup km
      await updateVehicle(selectedVehicle.id, { status: 'rented', currentKm: rental.startKm || 0 });

      // Generate and upload pre-rental PDF
      const pdfDataUrl = await generatePreRentalPdf(created, selectedVehicle);
      const pdfUrl = await uploadPdf(created.id, 'pre', pdfDataUrl);

      await updateRental(created.id, {
        documents: { preRentalPdf: pdfUrl },
      });

      navigate(`/rent/izposoja/${created.id}/podpis`);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err instanceof Error ? err.message : 'Napaka pri ustvarjanju naloga.' });
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Izberi vozilo *</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Izberi vozilo iz flote" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.length === 0 && (
                    <SelectItem value="__none__" disabled>Ni prostih vozil</SelectItem>
                  )}
                  {availableVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.licensePlate}) – {v.currentKm.toLocaleString('sl-SI')} km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicle && <p className="text-xs text-destructive">{errors.vehicle}</p>}
            </div>

            {selectedVehicle && (
              <Card className="bg-muted/50">
                <CardContent className="p-4 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Znamka/model:</span> {selectedVehicle.make} {selectedVehicle.model}</div>
                  <div><span className="text-muted-foreground">Registrska:</span> {selectedVehicle.licensePlate}</div>
                  <div><span className="text-muted-foreground">Letnik:</span> {selectedVehicle.year ?? '-'}</div>
                  <div><span className="text-muted-foreground">Barva:</span> {selectedVehicle.color ?? '-'}</div>
                  <div><span className="text-muted-foreground">Km:</span> {selectedVehicle.currentKm.toLocaleString('sl-SI')}</div>
                  <div><span className="text-muted-foreground">Gorivo:</span> {selectedVehicle.fuelLevel ?? '-'} %</div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="protocolNumber">Številka zapisnika</Label>
              <Input
                id="protocolNumber"
                value={rental.protocolNumber || ''}
                onChange={(e) => updateRentalField('protocolNumber', e.target.value)}
                placeholder="npr. 2026-001"
              />
            </div>

            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCameraOpen(true)}
                disabled={ocrLoading}
              >
                <ScanLine className="w-4 h-4 mr-2" />
                {ocrLoading ? `Prepoznavam... ${progress}%` : 'Skeniraj registrsko tablico'}
              </Button>
              {ocrError && <p className="text-xs text-destructive mt-2">{ocrError}</p>}
            </div>

            {cameraOpen && (
              <CameraCapture
                onClose={() => setCameraOpen(false)}
                onCapture={async (dataUrl) => {
                  const plate = await recognize(dataUrl);
                  if (plate) {
                    const matched = vehicles.find((v) =>
                      v.licensePlate.replace(/\s/g, '').toUpperCase() === plate
                    );
                    if (matched) {
                      setSelectedVehicleId(matched.id);
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        vehicle: `Prepoznana tablica ${plate} ni v seznamu vozil.`,
                      }));
                    }
                  }
                }}
              />
            )}
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ime in priimek *</Label>
              <Input
                id="fullName"
                value={customer.fullName}
                onChange={(e) => updateCustomer('fullName', e.target.value)}
                placeholder="npr. Janez Novak"
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={customer.phone}
                onChange={(e) => updateCustomer('phone', e.target.value)}
                placeholder="npr. 040 123 456"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Naslov *</Label>
              <Input
                id="address"
                value={customer.address}
                onChange={(e) => updateCustomer('address', e.target.value)}
                placeholder="npr. Vipavska cesta 10, 5271 Vipava"
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="authorizedDriver">Voznik po potnem nalogu</Label>
              <Input
                id="authorizedDriver"
                value={customer.authorizedDriver || ''}
                onChange={(e) => updateCustomer('authorizedDriver', e.target.value)}
                placeholder="npr. Janez Novak"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emso">Emšo</Label>
              <Input
                id="emso"
                value={customer.emso || ''}
                onChange={(e) => updateCustomer('emso', e.target.value)}
                placeholder="npr. 0105961500123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">Davčna številka</Label>
              <Input
                id="taxNumber"
                value={customer.taxNumber || ''}
                onChange={(e) => updateCustomer('taxNumber', e.target.value)}
                placeholder="npr. 12345678"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="startDate">Datum in ura prevzema *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={rental.startDate || ''}
                onChange={(e) => updateRentalField('startDate', e.target.value)}
              />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedReturnDate">Predviden datum in ura vrnitve</Label>
              <Input
                id="expectedReturnDate"
                type="datetime-local"
                value={rental.expectedReturnDate || ''}
                onChange={(e) => updateRentalField('expectedReturnDate', e.target.value)}
              />
              {errors.expectedReturnDate && <p className="text-xs text-destructive">{errors.expectedReturnDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startKm">Kilometrina ob prevzemu *</Label>
              <NumberInput
                id="startKm"
                min={0}
                value={rental.startKm}
                onChange={(value) => updateRentalField('startKm', value ?? 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Lokacija prevzema</Label>
              <Input
                id="pickupLocation"
                value={rental.pickupLocation || ''}
                onChange={(e) => updateRentalField('pickupLocation', e.target.value)}
                placeholder="npr. Vipava"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnLocation">Lokacija vrnitve</Label>
              <Input
                id="returnLocation"
                value={rental.returnLocation || ''}
                onChange={(e) => updateRentalField('returnLocation', e.target.value)}
                placeholder="npr. Vipava"
              />
            </div>

            <div className="space-y-3 md:col-span-2 border rounded-lg p-4 bg-muted/30">
              <p className="text-sm font-medium">Zavarovanje</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <YesNoField
                  label="Zavarovanje oseb"
                  value={true}
                  onChange={() => {}}
                />
                <YesNoField
                  label="Zavarovanje kasko"
                  value={true}
                  onChange={() => {}}
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2 border rounded-lg p-4">
              <p className="text-sm font-medium">Dostava vozila</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <YesNoField
                  label="Dostava"
                  value={rental.delivery ?? false}
                  onChange={(value) => updateRentalField('delivery', value)}
                />
                <YesNoField
                  label="Z vleko"
                  value={rental.deliveryWithTow ?? false}
                  onChange={(value) => updateRentalField('deliveryWithTow', value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryLocation" className="text-sm">Kraj dostave</Label>
                <Input
                  id="deliveryLocation"
                  value={rental.deliveryLocation || ''}
                  onChange={(e) => updateRentalField('deliveryLocation', e.target.value)}
                  placeholder="npr. Nova Gorica"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2 border rounded-lg p-4">
              <p className="text-sm font-medium">Prevzem vozila</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <YesNoField
                  label="Prevzem"
                  value={rental.pickup ?? false}
                  onChange={(value) => updateRentalField('pickup', value)}
                />
                <YesNoField
                  label="Z vleko"
                  value={rental.pickupWithTow ?? false}
                  onChange={(value) => updateRentalField('pickupWithTow', value)}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cleanOut">Čisto ob prevzemu</Label>
              <Select
                value={condition.cleanOut ? 'yes' : 'no'}
                onValueChange={(v) => setCondition((prev) => ({ ...prev, cleanOut: v === 'yes' }))}
              >
                <SelectTrigger id="cleanOut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Da</SelectItem>
                  <SelectItem value="no">Ne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="damageNotesOut">Opombe / poškodbe ob prevzemu</Label>
              <Textarea
                id="damageNotesOut"
                value={condition.damageNotesOut || ''}
                onChange={(e) => setCondition((prev) => ({ ...prev, damageNotesOut: e.target.value }))}
                placeholder="Opiši obstoječe poškodbe ali posebnosti..."
                rows={3}
              />
            </div>

            <div className="space-y-3 md:col-span-2 border rounded-lg p-4">
              <p className="text-base md:text-sm font-medium">Oprema vozila (stanje ob prevzemu)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(
                  [
                    ['documents', 'Dokumenti'],
                    ['firstAid', 'Prva pomoč'],
                    ['jack', 'Dvigalo'],
                    ['bulbs', 'Žarnice'],
                    ['triangle', 'Trikotnik'],
                    ['spareWheel', 'Rezervna guma'],
                    ['fireExtinguisher', 'Gasilni aparat'],
                    ['radio', 'Radio'],
                    ['antenna', 'Antena'],
                  ] as [keyof RentalOrder['condition']['equipment'], string][]
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={`eq-${key}`}
                      checked={condition.equipment?.[key] ?? true}
                      onCheckedChange={(checked) => updateEquipment(key, checked === true)}
                    />
                    <Label htmlFor={`eq-${key}`} className="text-base md:text-sm font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Pregled pred izposojo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p><span className="text-muted-foreground">Vozilo:</span> {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})</p>
                  <p><span className="text-muted-foreground">Stranka:</span> {customer.fullName}</p>
                  <p><span className="text-muted-foreground">Telefon:</span> {customer.phone}</p>
                  <p><span className="text-muted-foreground">Prevzem:</span> {new Date(rental.startDate || '').toLocaleString('sl-SI')}</p>
                  <p><span className="text-muted-foreground">Vrnitev:</span> {new Date(rental.expectedReturnDate || '').toLocaleString('sl-SI')}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Po potrditvi se ustvari pred-izposojni PDF in odpre podpisna stran.</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 md:pb-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rent')} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-display font-bold">Nova izposoja</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 md:w-8 md:h-8 rounded-full flex items-center justify-center text-base md:text-sm font-semibold ${
                  idx <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {idx < step ? <Check className="w-5 h-5 md:w-4 md:h-4" /> : idx + 1}
              </div>
              <span className="text-xs mt-1 text-center leading-tight px-1">{label}</span>
            </div>
            {idx < STEPS.length - 1 && <div className={`flex-1 h-1.5 md:h-1 mx-1 ${idx < step ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-base">{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">{renderStep()}</CardContent>
      </Card>

      {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:static md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none z-50">
        <div className="flex justify-between gap-3 max-w-7xl mx-auto">
          <Button variant="outline" onClick={prevStep} disabled={step === 0} className="flex-1 md:flex-none min-h-12">
            Nazaj
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep} className="btn-emergency flex-1 md:flex-none min-h-12">
              Naprej
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="btn-emergency flex-1 md:flex-none min-h-12" disabled={saving}>
              {saving ? 'Ustvarjanje...' : 'Ustvari nalog in PDF'}
              <FileText className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
