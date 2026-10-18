import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRentAuth } from '@/hooks/useRentAuth';
import { isAdmin } from '@/lib/roles';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, ClipboardList, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import type { RentVehicle, RentalOrder } from '@/types/rent';

type Section = 'available' | 'active' | 'returns' | null;

function VehicleListItem({ vehicle, label }: { vehicle: RentVehicle; label?: string }) {
  return (
    <Link
      to={`/rent/vozila/${vehicle.id}`}
      className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
    >
      <div>
        <p className="font-semibold">
          {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
        </p>
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </Link>
  );
}

function RentalListItem({ rental, vehicle }: { rental: RentalOrder; vehicle?: RentVehicle }) {
  return (
    <Link
      key={rental.id}
      to={`/rent/izposoja/${rental.id}`}
      className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
    >
      <div>
        <p className="font-semibold">
          {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Neznano vozilo'}
        </p>
        <p className="text-sm text-muted-foreground">{rental.customer.fullName}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
    </Link>
  );
}

export default function RentDashboard() {
  const { user } = useRentAuth();
  const admin = isAdmin(user);
  const { vehicles } = useVehicles();
  const { rentals } = useRentals();
  const [activeSection, setActiveSection] = useState<Section>('returns');

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayReturns = rentals.filter(
    (r) =>
      r.status === 'active' &&
      r.rental.expectedReturnDate &&
      r.rental.expectedReturnDate.startsWith(today)
  );
  const activeRentals = rentals.filter((r) => r.status === 'active');
  const availableVehicles = vehicles.filter((v) => v.status === 'available');

  const toggleSection = (section: Section) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const cards = [
    {
      key: 'available' as const,
      title: 'Prosta vozila',
      count: availableVehicles.length,
      icon: Car,
    },
    {
      key: 'active' as const,
      title: 'Aktivni najemi',
      count: activeRentals.length,
      icon: ClipboardList,
    },
    {
      key: 'returns' as const,
      title: 'Vrnitve danes',
      count: todayReturns.length,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-display font-bold">Pregled izposoje</h1>
        {admin && (
          <Button asChild className="btn-emergency w-full sm:w-auto">
            <Link to="/rent/izposoja/nova">
              <ClipboardList className="w-4 h-4 mr-2" />
              Nov nalog
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {cards.map(({ key, title, count, icon: Icon }) => {
          const isActive = activeSection === key;
          return (
            <Card
              key={key}
              className={`bg-card border-border cursor-pointer transition-colors ${
                isActive ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
              }`}
              onClick={() => toggleSection(key)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span>{title}</span>
                  {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="text-3xl font-bold">{count}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeSection === 'available' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg md:text-base">Prosta vozila</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableVehicles.length === 0 ? (
              <p className="text-muted-foreground">Trenutno ni prostih vozil.</p>
            ) : (
              availableVehicles.map((v) => <VehicleListItem key={v.id} vehicle={v} label={`${v.currentKm.toLocaleString('sl-SI')} km`} />)
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === 'active' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg md:text-base">Aktivni najemi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeRentals.length === 0 ? (
              <p className="text-muted-foreground">Trenutno ni aktivnih najemov.</p>
            ) : (
              activeRentals.map((r) => {
                const vehicle = vehicles.find((v) => v.id === r.vehicleId);
                return <RentalListItem key={r.id} rental={r} vehicle={vehicle} />;
              })
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === 'returns' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg md:text-base">Današnje vrnitve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayReturns.length === 0 ? (
              <p className="text-muted-foreground">Danes ni predvidenih vrnitev.</p>
            ) : (
              todayReturns.map((r) => {
                const vehicle = vehicles.find((v) => v.id === r.vehicleId);
                return <RentalListItem key={r.id} rental={r} vehicle={vehicle} />;
              })
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
