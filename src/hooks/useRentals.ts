import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapRentalOrder, toRentalOrderRow } from '@/lib/rentMappers';
import type { RentalOrder, RentVehicle } from '@/types/rent';

export function useRentals() {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaError } = await supabase
        .from('rental_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (supaError) throw supaError;
      setRentals((data ?? []).map(mapRentalOrder));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const createRental = useCallback(
    async (order: Omit<RentalOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error: supaError } = await supabase
        .from('rental_orders')
        .insert(toRentalOrderRow(order))
        .select()
        .single();
      if (supaError) throw supaError;
      const created = mapRentalOrder(data);
      setRentals((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateRental = useCallback(async (id: string, updates: Partial<RentalOrder>) => {
    const { data, error: supaError } = await supabase
      .from('rental_orders')
      .update(toRentalOrderRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (supaError) throw supaError;
    const updated = mapRentalOrder(data);
    setRentals((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const deleteRental = useCallback(async (id: string) => {
    const { error: supaError } = await supabase.from('rental_orders').delete().eq('id', id);
    if (supaError) throw supaError;
    setRentals((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getActiveByVehicle = useCallback(
    (vehicleId: string) => rentals.find((r) => r.vehicleId === vehicleId && r.status !== 'returned'),
    [rentals]
  );

  const getReturnsByDate = useCallback(
    (date: string) =>
      rentals.filter(
        (r) =>
          r.status === 'active' &&
          r.rental.expectedReturnDate &&
          r.rental.expectedReturnDate.startsWith(date)
      ),
    [rentals]
  );

  return {
    rentals,
    loading,
    error,
    fetchRentals,
    createRental,
    updateRental,
    deleteRental,
    getActiveByVehicle,
    getReturnsByDate,
  };
}

export function useVehicleRentals(vehicleId?: string) {
  const { rentals } = useRentals();
  return rentals.filter((r) => r.vehicleId === vehicleId);
}
