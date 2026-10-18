import type { User } from '@supabase/supabase-js';

// Seznam admin e-poštnih naslovov. Tukaj dodaj vse račune, ki naj imajo adminske pravice.
// Uporablja se kot rezerva, če v metadata ni shranjena vloga.
export const ADMIN_EMAILS: string[] = [
        'stucin.martin@gmail.com',
];

function normalizeEmail(email?: string): string {
  return (email || '').toLowerCase().trim();
}

function isAdminEmail(email?: string): boolean {
  return ADMIN_EMAILS.includes(normalizeEmail(email));
}

function isAdminMetadata(user?: User | null): boolean {
  return user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
}

export function isAdmin(userOrEmail?: User | string | null): boolean {
  if (!userOrEmail) return false;
  if (typeof userOrEmail === 'string') return isAdminEmail(userOrEmail);
  return isAdminMetadata(userOrEmail) || isAdminEmail(userOrEmail.email);
}

export function isWorker(userOrEmail?: User | string | null): boolean {
  // Vsak prijavljen uporabnik, ki ni admin, je delavec.
  if (!userOrEmail) return false;
  if (typeof userOrEmail === 'string') return !isAdminEmail(userOrEmail);
  return !isAdmin(userOrEmail);
}

export function getRoleLabel(user?: User | null): 'Admin' | 'Delavec' {
  return isAdmin(user) ? 'Admin' : 'Delavec';
}
