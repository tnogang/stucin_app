import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapVehicle, toVehicleRow } from '@/lib/rentMappers';
import type { RentVehicle } from '@/types/rent';
import { markVehicleDeleted } from '@/types/rent';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<RentVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supaError } = await supabase
        .from('vehicles')
        .select('*')
        .order('make', { ascending: true })
        .order('model', { ascending: true });
      if (supaError) throw supaError;
      setVehicles((data ?? []).map(mapVehicle));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const createVehicle = useCallback(
    async (vehicle: Omit<RentVehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error: supaError } = await supabase
        .from('vehicles')
        .insert(toVehicleRow(vehicle))
        .select()
        .single();
      if (supaError) throw supaError;
      const created = mapVehicle(data);
      setVehicles((prev) => [...prev, created].sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model)));
      return created;
    },
    []
  );

  const updateVehicle = useCallback(async (id: string, updates: Partial<RentVehicle>) => {
    const { data, error: supaError } = await supabase
      .from('vehicles')
      .update(toVehicleRow(updates))
      .eq('id', id)
      .select()
      .single();
    if (supaError) throw supaError;
    const updated = mapVehicle(data);
    setVehicles((prev) =>
      prev
        .map((v) => (v.id === id ? updated : v))
        .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model))
    );
    return updated;
  }, []);

  const deleteVehicle = useCallback(async (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) throw new Error('Vozilo ni najdeno.');
    const { data, error: supaError } = await supabase
      .from('vehicles')
      .update(
        toVehicleRow({
          status: 'retired',
          notes: markVehicleDeleted(vehicle.notes),
        })
      )
      .eq('id', id)
      .select()
      .single();
    if (supaError) throw supaError;
    setVehicles((prev) =>
      prev
        .map((v) => (v.id === id ? mapVehicle(data) : v))
        .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model))
    );
  }, [vehicles]);

  return { vehicles, loading, error, fetchVehicles, createVehicle, updateVehicle, deleteVehicle };
}
