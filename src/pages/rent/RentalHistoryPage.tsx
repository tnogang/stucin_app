import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, FileText, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { RentalStatus, RentalOrder, RentVehicle } from '@/types/rent';
import { generatePreRentalPdf, generatePostRentalPdf, openPdfDataUrl } from '@/lib/pdfGenerator';

const statusLabels: Record<RentalStatus, string> = {
  draft: 'Osnutek',
  signed: 'Podpisan',
  active: 'Aktiven',
  returned: 'Vrnjen',
};

const statusVariant: Record<RentalStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  signed: 'secondary',
  active: 'default',
  returned: 'destructive',
};

export default function RentalHistoryPage() {
  const { rentals, loading } = useRentals();
  const { vehicles } = useVehicles();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'all'>('all');
  const [pdfLoading, setPdfLoading] = useState<{ id: string; type: 'pre' | 'post' } | null>(null);

  const filtered = useMemo(() => {
    return rentals.filter((r) => {
      const vehicle = vehicles.find((v) => v.id === r.vehicleId);
      const q = search.toLowerCase();
      const protocol = r.rental.protocolNumber || '';
      const matchesSearch =
        r.customer.fullName.toLowerCase().includes(q) ||
        (vehicle?.licensePlate || '').toLowerCase().includes(q) ||
        `${vehicle?.make} ${vehicle?.model}`.toLowerCase().includes(q) ||
        protocol.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rentals, vehicles, search, statusFilter]);

  const handleOpenPdf = async (order: RentalOrder, vehicle: RentVehicle | undefined, type: 'pre' | 'post') => {
    if (!vehicle) {
      toast.error('Vozila ni mogoče najti.');
      return;
    }
    setPdfLoading({ id: order.id, type });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold">Zgodovina izposoj</h1>
        <Button asChild className="btn-emergency w-full sm:w-auto">
          <Link to="/rent/izposoja/nova">Nov nalog</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Išči po številki, stranki ali vozilu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RentalStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Vsi statusi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Vsi statusi</SelectItem>
            <SelectItem value="draft">Osnutek</SelectItem>
            <SelectItem value="signed">Podpisan</SelectItem>
            <SelectItem value="active">Aktiven</SelectItem>
            <SelectItem value="returned">Vrnjen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Nalaganje...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">Ni najdenih nalogov.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Številka</TableHead>
                <TableHead>Vozilo</TableHead>
                <TableHead>Stranka</TableHead>
                <TableHead>Prevzem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const vehicle = vehicles.find((v) => v.id === r.vehicleId);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.rental.protocolNumber || `Nalog #${r.id.slice(0, 8)}`}
                    </TableCell>
                    <TableCell className="font-medium">
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Neznano vozilo'}
                      <br />
                      <span className="text-xs text-muted-foreground">{vehicle?.licensePlate}</span>
                    </TableCell>
                    <TableCell>{r.customer.fullName}</TableCell>
                    <TableCell>
                      {new Date(r.rental.startDate).toLocaleDateString('sl-SI')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[r.status]}>{statusLabels[r.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(r.documents.preRentalPdf || r.status !== 'draft') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Pred-izposojni PDF"
                            onClick={() => handleOpenPdf(r, vehicle, 'pre')}
                            disabled={pdfLoading?.id === r.id && pdfLoading?.type === 'pre'}
                          >
                            {pdfLoading?.id === r.id && pdfLoading?.type === 'pre' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        {(r.documents.postRentalPdf || r.status === 'returned') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Zaključni PDF"
                            onClick={() => handleOpenPdf(r, vehicle, 'post')}
                            disabled={pdfLoading?.id === r.id && pdfLoading?.type === 'post'}
                          >
                            {pdfLoading?.id === r.id && pdfLoading?.type === 'post' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/rent/izposoja/${r.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((r) => {
            const vehicle = vehicles.find((v) => v.id === r.vehicleId);
            return (
              <div key={r.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {r.rental.protocolNumber || `Nalog #${r.id.slice(0, 8)}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{r.customer.fullName}</p>
                  </div>
                  <Badge variant={statusVariant[r.status]}>{statusLabels[r.status]}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Neznano vozilo'}
                    {vehicle?.licensePlate && (
                      <span className="text-muted-foreground"> · {vehicle.licensePlate}</span>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    Prevzem: {new Date(r.rental.startDate).toLocaleDateString('sl-SI')}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  {(r.documents.preRentalPdf || r.status !== 'draft') && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="min-h-11 min-w-11"
                      title="Pred-izposojni PDF"
                      onClick={() => handleOpenPdf(r, vehicle, 'pre')}
                      disabled={pdfLoading?.id === r.id && pdfLoading?.type === 'pre'}
                    >
                      {pdfLoading?.id === r.id && pdfLoading?.type === 'pre' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  {(r.documents.postRentalPdf || r.status === 'returned') && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="min-h-11 min-w-11"
                      title="Zaključni PDF"
                      onClick={() => handleOpenPdf(r, vehicle, 'post')}
                      disabled={pdfLoading?.id === r.id && pdfLoading?.type === 'post'}
                    >
                      {pdfLoading?.id === r.id && pdfLoading?.type === 'post' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" className="min-h-11 min-w-11" asChild>
                    <Link to={`/rent/izposoja/${r.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
