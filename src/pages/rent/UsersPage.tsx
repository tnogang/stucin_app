import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentAuth } from '@/hooks/useRentAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, UserPlus, Info } from 'lucide-react';

type Role = 'admin' | 'worker';

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useRentAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('worker');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (!email.trim() || !password.trim()) {
      setResult({ type: 'error', message: 'Vnesi e-pošto in geslo.' });
      return;
    }
    if (password.length < 6) {
      setResult({ type: 'error', message: 'Geslo mora imeti vsaj 6 znakov.' });
      return;
    }

    setLoading(true);
    try {
      // Shranimo trenutno admin sejo, da jo lahko obnovimo po ustvarjanju novega uporabnika.
      const {
        data: { session: adminSession },
      } = await supabase.auth.getSession();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { role },
        },
      });

      // Poskusimo obnoviti admin sejo, da ustvarjalnik ostane prijavljen.
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }

      if (error) throw error;

      setResult({
        type: 'success',
        message: `Uporabnik ${data.user?.email || email} je bil ustvarjen z vlogo ${role === 'admin' ? 'admin' : 'delavec'}.`,
      });
      setEmail('');
      setPassword('');
      setRole('worker');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Napaka pri ustvarjanju uporabnika.';
      setResult({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rent')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-display font-bold">Uporabniki</h1>
      </div>

      <Alert variant="default" className="bg-muted/50">
        <Info className="w-4 h-4" />
        <AlertDescription>
          Tukaj lahko admin ustvari nove račune za delavce ali druge admina. Če je v Supabase vklopljena
          potrditev e-pošte, mora nov uporabnik potrditi račun pred prvo prijavo.
        </AlertDescription>
      </Alert>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Nov uporabnik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-pošta *</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="npr. delavec@avtovleka-stucin.si"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Začasno geslo *</Label>
              <Input
                id="password"
                type="text"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vsaj 6 znakov"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vloga *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Izberi vlogo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Delavec (zaključuje najeme, vidi vozila)</SelectItem>
                  <SelectItem value="admin">Admin (ustvarja najeme in vozila)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {result && (
              <p className={`text-sm ${result.type === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
                {result.message}
              </p>
            )}

            <Button type="submit" className="btn-emergency w-full sm:w-auto" disabled={loading}>
              {loading ? 'Ustvarjanje...' : 'Ustvari uporabnika'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
