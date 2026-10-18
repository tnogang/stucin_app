import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PenTool, RotateCcw, FileText } from 'lucide-react';
import { generatePreRentalPdf, generatePostRentalPdf, openPdfDataUrl } from '@/lib/pdfGenerator';
import { toast } from 'sonner';

const statusLabels: Record<string, string> = {
  draft: 'Osnutek',
  signed: 'Podpisan',
  active: 'Aktiven',
  returned: 'Vrnjen',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  signed: 'secondary',
  active: 'default',
  returned: 'destructive',
};

export default function RentalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rentals, deleteRental } = useRentals();
  const { vehicles } = useVehicles();

  const order = rentals.find((r) => r.id === id);
  const vehicle = vehicles.find((v) => v.id === order?.vehicleId);

  const [pdfLoading, setPdfLoading] = useState<'pre' | 'post' | null>(null);

  if (!order || !vehicle) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nalog ni mogoče najti.</p>
        <Button asChild className="mt-4">
          <Link to="/rent/zgodovina">Nazaj na zgodovino</Link>
        </Button>
      </div>
    );
  }

  const openPdf = async (type: 'pre' | 'post') => {
    setPdfLoading(type);
    try {
      const dataUrl =
        type === 'pre'
          ? await generatePreRentalPdf(order, vehicle)
          : await generatePostRentalPdf(order, vehicle);
      await openPdfDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
      toast.error('Napaka pri generiranju PDFja.');
    } finally {
      setPdfLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Ali si prepričan/a, da želiš izbrisati ta nalog?')) return;
    await deleteRental(order.id);
    navigate('/rent/zgodovina');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/rent/zgodovina')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">{order.rental.protocolNumber ? `Nalog #${order.rental.protocolNumber}` : `Nalog #${order.id.slice(0, 8)}`}</h1>
            <p className="text-sm text-muted-foreground">
              {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
            </p>
          </div>
        </div>
        <Badge variant={statusVariant[order.status]} className="w-fit">{statusLabels[order.status]}</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        {order.status === 'draft' && (
          <Button asChild className="btn-emergency">
            <Link to={`/rent/izposoja/${order.id}/podpis`}>
              <PenTool className="w-4 h-4 mr-2" />
              Podpiši stranko
            </Link>
          </Button>
        )}
        {order.status === 'active' && (
          <Button asChild className="btn-emergency">
            <Link to={`/rent/izposoja/${order.id}/vrnitev`}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Zaključi vrnitev
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => openPdf('pre')}
          disabled={pdfLoading === 'pre'}
        >
          <FileText className="w-4 h-4 mr-2" />
          {pdfLoading === 'pre' ? 'Generiram PDF...' : 'Pred-izposojni PDF'}
        </Button>
        {order.status === 'returned' && (
          <Button
            variant="outline"
            onClick={() => openPdf('post')}
            disabled={pdfLoading === 'post'}
          >
            <FileText className="w-4 h-4 mr-2" />
            {pdfLoading === 'post' ? 'Generiram PDF...' : 'Zaključni PDF'}
          </Button>
        )}
        <Button variant="ghost" className="text-destructive" onClick={handleDelete}>
          Izbriši nalog
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Podatki o stranki</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Ime:</span> {order.customer.fullName}</p>
            <p><span className="text-muted-foreground">Naslov:</span> {order.customer.address}</p>
            <p><span className="text-muted-foreground">Telefon:</span> {order.customer.phone}</p>
            <p><span className="text-muted-foreground">Voznik po potnem nalogu:</span> {order.customer.authorizedDriver || '-'}</p>
            <p><span className="text-muted-foreground">Emšo / davčna:</span> {order.customer.emso || '-'} / {order.customer.taxNumber || '-'}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Podatki o izposoji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Prevzem:</span>{' '}
              {new Date(order.rental.startDate).toLocaleString('sl-SI')}
            </p>
            <p>
              <span className="text-muted-foreground">Predvidena vrnitev:</span>{' '}
              {order.rental.expectedReturnDate
                ? new Date(order.rental.expectedReturnDate).toLocaleString('sl-SI')
                : '-'}
            </p>
            {order.rental.actualReturnDate && (
              <p>
                <span className="text-muted-foreground">Dejanska vrnitev:</span>{' '}
                {new Date(order.rental.actualReturnDate).toLocaleString('sl-SI')}
              </p>
            )}
            <p><span className="text-muted-foreground">Km ob prevzemu:</span> {order.rental.startKm.toLocaleString('sl-SI')}</p>
            <p><span className="text-muted-foreground">Km ob vrnitvi:</span> {order.rental.returnKm?.toLocaleString('sl-SI') || '-'}</p>
            <p><span className="text-muted-foreground">Zavarovanje oseb:</span> Da</p>
            <p><span className="text-muted-foreground">Zavarovanje kasko:</span> Da</p>
            <p><span className="text-muted-foreground">Dostava:</span> {order.rental.delivery ? `Da${order.rental.deliveryWithTow ? ' (z vleko)' : ''}${order.rental.deliveryLocation ? ` - ${order.rental.deliveryLocation}` : ''}` : 'Ne'}</p>
            <p><span className="text-muted-foreground">Prevzem:</span> {order.rental.pickup ? `Da${order.rental.pickupWithTow ? ' (z vleko)' : ''}${order.rental.pickupLocation ? ` - ${order.rental.pickupLocation}` : ''}` : 'Ne'}</p>
            <p><span className="text-muted-foreground">Lokacija vrnitve:</span> {order.rental.returnLocation || 'Vipava'}</p>
          </CardContent>
        </Card>

        {order.status === 'active' && order.rental.returnLocation && (
          <Card className="bg-primary/10 border-primary/30 md:col-span-2">
            <CardContent className="p-4">
              <p className="text-base md:text-sm font-semibold text-primary">
                Avto je treba iti iskat v: {order.rental.returnLocation}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Stanje vozila ob prevzemu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Čisto:</span> {order.condition.cleanOut ? 'Da' : 'Ne'}</p>
            <p><span className="text-muted-foreground">Opombe:</span> {order.condition.damageNotesOut || '-'}</p>
            {order.condition.equipment && (
              <p><span className="text-muted-foreground">Oprema:</span> {Object.entries(order.condition.equipment)
                .filter(([, v]) => v)
                .map(([k]) => {
                  const labels: Record<string, string> = {
                    documents: 'dokumenti',
                    firstAid: 'prva pomoč',
                    jack: 'dvigalo',
                    bulbs: 'žarnice',
                    triangle: 'trikotnik',
                    spareWheel: 'rezervna guma',
                    fireExtinguisher: 'gasilni aparat',
                    radio: 'radio',
                    antenna: 'antena',
                  };
                  return labels[k] || k;
                })
                .join(', ')}</p>
            )}
          </CardContent>
        </Card>

        {order.status === 'returned' && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Stanje vozila ob vrnitvi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Čisto:</span> {order.condition.cleanIn ? 'Da' : 'Ne'}</p>
              <p><span className="text-muted-foreground">Opombe:</span> {order.condition.damageNotesIn || '-'}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
