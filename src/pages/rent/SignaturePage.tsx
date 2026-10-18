import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eraser, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { uploadPdf } from '@/lib/rentStorage';
import { generatePreRentalPdf } from '@/lib/pdfGenerator';

type Step = 'customer' | 'employee';

function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width));
    canvas.height = Math.max(1, Math.floor(rect.height));
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setHasDrawing(true);
    }
    setIsDrawing(false);
  };

  const clear = () => {
    initCanvas();
  };

  const toDataUrl = () => canvasRef.current?.toDataURL('image/png') ?? '';

  return {
    canvasRef,
    hasDrawing,
    initCanvas,
    startDrawing,
    draw,
    stopDrawing,
    clear,
    toDataUrl,
  };
}

export default function SignaturePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals, updateRental } = useRentals();
  const { vehicles } = useVehicles();
  const pad = useSignaturePad();
  const [step, setStep] = useState<Step>('customer');
  const [customerSignature, setCustomerSignature] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const order = rentals.find((r) => r.id === id);
  const vehicle = vehicles.find((v) => v.id === order?.vehicleId);

  useEffect(() => {
    if (!order) return;
    if (order.status !== 'draft' && order.status !== 'signed') {
      navigate(`/rent/izposoja/${order.id}`);
    }
  }, [order, navigate]);

  const nextStep = () => {
    if (!pad.hasDrawing) {
      setError('Najemnik mora podpisati.');
      return;
    }
    setCustomerSignature(pad.toDataUrl());
    setError('');
    setStep('employee');
    pad.clear();
  };

  const prevStep = () => {
    setStep('customer');
    setError('');
    pad.clear();
  };

  const save = async () => {
    if (!id || !order || !vehicle) return;
    if (!customerSignature) {
      setError('Manjka podpis najemnika.');
      setStep('customer');
      return;
    }
    if (!pad.hasDrawing) {
      setError('Izdajatelj mora podpisati.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const employeeOut = pad.toDataUrl();
      if (!employeeOut) {
        throw new Error('Podpis ni na voljo');
      }

      const orderForPdf = {
        ...order,
        signatures: {
          ...order.signatures,
          customerOut: customerSignature,
          employeeOut,
        },
        status: 'active' as const,
      };

      const pdfDataUrl = await generatePreRentalPdf(orderForPdf, vehicle);
      const finalPdfUrl = await uploadPdf(id, 'pre', pdfDataUrl);

      await updateRental(id, {
        status: 'active',
        signatures: orderForPdf.signatures,
        documents: { ...order.documents, preRentalPdf: finalPdfUrl },
      });

      navigate(`/rent/izposoja/${id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Napaka pri shranjevanju podpisa.');
    } finally {
      setSaving(false);
    }
  };

  if (!order || !vehicle) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nalog ni mogoče najti.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/rent/izposoja/${id}`)} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-display font-bold">
          {step === 'customer' ? 'Podpis najemnika' : 'Podpis izdajatelja'}
        </h1>
      </div>

      <Card className="bg-muted/50 border-border">
        <CardContent className="p-4 text-base md:text-sm">
          <p>
            {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) – {order.customer.fullName}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-base">
            {step === 'customer' ? 'Najemnik' : 'Izdajatelj'}
          </CardTitle>
          <p className="text-base md:text-sm text-muted-foreground">
            {step === 'customer'
              ? 'S prstom ali miško podpiši v spodnje polje.'
              : 'Izdajatelj s prstom ali miško podpiši v spodnje polje.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl overflow-hidden bg-white">
            <canvas
              ref={pad.canvasRef}
              className="w-full h-64 md:h-56 touch-none cursor-crosshair"
              onMouseDown={pad.startDrawing}
              onMouseMove={pad.draw}
              onMouseUp={pad.stopDrawing}
              onMouseLeave={pad.stopDrawing}
              onTouchStart={pad.startDrawing}
              onTouchMove={pad.draw}
              onTouchEnd={pad.stopDrawing}
            />
          </div>

          <Button variant="outline" onClick={pad.clear} type="button" className="w-full min-h-12">
            <Eraser className="w-5 h-5 mr-2" />
            Počisti podpis
          </Button>
        </CardContent>
      </Card>

      {error && <p className="text-base md:text-sm text-destructive">{error}</p>}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:static md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none z-50">
        <div className="flex justify-between gap-3 max-w-2xl mx-auto">
          {step === 'employee' ? (
            <Button variant="outline" onClick={prevStep} disabled={saving} className="flex-1 md:flex-none min-h-12">
              Nazaj
            </Button>
          ) : (
            <div />
          )}

          {step === 'customer' ? (
            <Button onClick={nextStep} className="btn-emergency flex-1 md:flex-none min-h-12">
              Naprej
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button onClick={save} className="btn-emergency flex-1 md:flex-none min-h-12" disabled={saving}>
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Shranjevanje...' : 'Shrani podpisa in aktiviraj nalog'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
