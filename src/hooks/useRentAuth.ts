import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useRentAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Najprej vzamemo sejo iz pomnilnika (hitro), nato pa osvežimo uporabnika s strežnika,
    // da ujamemo morebitne spremembe v metadata (npr. role: 'admin').
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session) {
        supabase.auth.getUser().then(({ data: { user: freshUser }, error }) => {
          if (!mounted) return;
          if (error) {
            console.warn('Napaka pri osveževanju uporabnika:', error.message);
            return;
          }
          if (freshUser) {
            setUser(freshUser);
          }
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return { session, user, loading, signIn, signOut };
}
