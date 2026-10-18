import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anon key is missing. Rent module will not work.');
}

// createClient() throws on empty values, which would crash the whole lazily
// loaded rent module (blank page). Placeholders keep the import side-effect
// safe; the warning above is the signal that the env vars are missing.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export type Tables = {
  vehicles: {
    id: string;
    make: string;
    model: string;
    type: string | null;
    year: number | null;
    license_plate: string;
    vin: string | null;
    color: string | null;
    registration_expiry: string | null;
    current_km: number;
    fuel_level: number | null;
    status: 'available' | 'rented' | 'maintenance' | 'retired' | 'deleted';
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  rental_orders: {
    id: string;
    vehicle_id: string;
    status: 'draft' | 'signed' | 'active' | 'returned';
    customer: Record<string, unknown>;
    rental: Record<string, unknown>;
    condition: Record<string, unknown>;
    signatures: Record<string, unknown>;
    documents: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
};
