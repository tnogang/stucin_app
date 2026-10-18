import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRentAuth } from '@/hooks/useRentAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function RentLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useRentAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/rent', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri prijavi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">Izposoja vozil</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Prijavi se za dostop do rent modula.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rent-email">E-pošta</Label>
              <Input
                id="rent-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="npr. ime@domena.si"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent-password">Geslo</Label>
              <div className="relative">
                <Input
                  id="rent-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Skrij geslo' : 'Pokaži geslo'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full btn-emergency" disabled={loading}>
              {loading ? 'Prijava...' : 'Prijavi se'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
