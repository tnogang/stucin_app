import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '@/hooks/useVehicles';
import { useRentals } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Car } from 'lucide-react';
import { useRentAuth } from '@/hooks/useRentAuth';
import { isAdmin } from '@/lib/roles';
import type { VehicleStatus } from '@/types/rent';
import { isDeletedVehicle } from '@/types/rent';

const statusLabels: Record<VehicleStatus, string> = {
  available: 'Na voljo',
  rented: 'Izposojeno',
  maintenance: 'Servis',
  retired: 'Upokojeno',
  deleted: 'Odstranjeno',
};

const statusVariant: Record<VehicleStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  available: 'default',
  rented: 'secondary',
  maintenance: 'outline',
  retired: 'destructive',
  deleted: 'destructive',
};

export default function VehicleListPage() {
  const navigate = useNavigate();
  const { user } = useRentAuth();
  const admin = isAdmin(user);
  const { vehicles, loading, deleteVehicle } = useVehicles();
  const { rentals } = useRentals();
  const [search, setSearch] = useState('');
  const [showRetired, setShowRetired] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeRentalByVehicle = new Map(
    rentals
      .filter((r) => r.status === 'active')
      .map((r) => [r.vehicleId, r])
  );

  const filtered = vehicles.filter((v) => {
    if (isDeletedVehicle(v)) return false;
    if (v.status === 'retired' && !showRetired) return false;
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.licensePlate.toLowerCase().includes(q) ||
      (v.vin && v.vin.toLowerCase().includes(q))
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteVehicle(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-bold">Vozila</h1>
        {admin && (
          <Button asChild className="btn-emergency w-full sm:w-auto">
            <Link to="/rent/vozila/novo">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj vozilo
            </Link>
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Išči po znamki, modelu, registrski..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="show-retired"
          checked={showRetired}
          onCheckedChange={(checked) => setShowRetired(checked === true)}
        />
        <Label htmlFor="show-retired" className="text-sm font-normal cursor-pointer">
          Pokaži tudi upokojena vozila
        </Label>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Nalaganje vozil...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Car className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {search ? 'Ni rezultatov iskanja.' : 'Ni vnesenih vozil.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-border rounded-xl overflow-hidden">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Znamka / model</TableHead>
                <TableHead>Registrska</TableHead>
                <TableHead>Letnik</TableHead>
                <TableHead>Km</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Predviden datum vrnitve</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vehicle) => {
                const activeRental = activeRentalByVehicle.get(vehicle.id);
                return (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.year ?? '-'}</TableCell>
                    <TableCell>{vehicle.currentKm.toLocaleString('sl-SI')}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[vehicle.status]}>{statusLabels[vehicle.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      {activeRental?.rental.expectedReturnDate
                        ? new Date(activeRental.rental.expectedReturnDate).toLocaleString('sl-SI')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                    {admin ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/rent/vozila/${vehicle.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog open={deleteId === vehicle.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={activeRentalByVehicle.has(vehicle.id)}
                              title={
                                activeRentalByVehicle.has(vehicle.id)
                                  ? 'Vozila ni mogoče odstraniti, ker je trenutno izposojeno.'
                                  : 'Odstrani vozilo iz programa'
                              }
                              onClick={() => setDeleteId(vehicle.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Odstrani vozilo iz programa?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Vozilo {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) bo odstranjeno iz seznama vozil.
                                Zgodovina izposoj in že ustvarjeni PDFji ostanejo shranjeni.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Prekliči</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                Odstrani
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">–</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((vehicle) => {
            const activeRental = activeRentalByVehicle.get(vehicle.id);
            return (
              <div key={vehicle.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                  </div>
                  <Badge variant={statusVariant[vehicle.status]}>{statusLabels[vehicle.status]}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Letnik: {vehicle.year ?? '-'}</p>
                  <p>Km: {vehicle.currentKm.toLocaleString('sl-SI')}</p>
                  <p>
                    Predvidena vrnitev:{' '}
                    {activeRental?.rental.expectedReturnDate
                      ? new Date(activeRental.rental.expectedReturnDate).toLocaleString('sl-SI')
                      : '-'}
                  </p>
                </div>
                {admin && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="min-h-11 min-w-11"
                      onClick={() => navigate(`/rent/vozila/${vehicle.id}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog open={deleteId === vehicle.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="min-h-11 min-w-11 text-destructive hover:text-destructive"
                          disabled={activeRentalByVehicle.has(vehicle.id)}
                          title={
                            activeRentalByVehicle.has(vehicle.id)
                              ? 'Vozila ni mogoče odstraniti, ker je trenutno izposojeno.'
                              : 'Odstrani vozilo iz programa'
                          }
                          onClick={() => setDeleteId(vehicle.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Odstrani vozilo iz programa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Vozilo {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) bo odstranjeno iz seznama vozil.
                            Zgodovina izposoj in že ustvarjeni PDFji ostanejo shranjeni.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteId(null)}>Prekliči</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Odstrani
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
