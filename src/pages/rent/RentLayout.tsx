import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRentAuth } from '@/hooks/useRentAuth';
import { useRentNotifications, setNotificationPreference } from '@/hooks/useRentNotifications';
import { isAdmin } from '@/lib/roles';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  History,
  LogOut,
  Menu,
  Bell,
  Users,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function RentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useRentAuth();
  const admin = isAdmin(user);
  const { enabled } = useRentNotifications(user?.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState(enabled);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { path: '/rent', label: 'Pregled', icon: LayoutDashboard },
      { path: '/rent/vozila', label: 'Vozila', icon: Car },
      ...(admin ? [{ path: '/rent/izposoja/nova', label: 'Nova izposoja', icon: PlusCircle }] : []),
      { path: '/rent/zgodovina', label: 'Zgodovina', icon: History },
      ...(admin ? [{ path: '/rent/uporabniki', label: 'Uporabniki', icon: Users }] : []),
    ],
    [admin]
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/rent/login', { replace: true });
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
          active
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const NotificationToggle = () => (
    <div className="mb-4 px-4 py-3 rounded-xl bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Obvestila</span>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={(checked) => {
            if (user?.email) {
              setNotificationPreference(user.email, checked);
              setNotificationsEnabled(checked);
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4">
        <div className="mb-8 px-4">
          <h1 className="font-display text-xl font-bold">Rent modul</h1>
          <p className="text-xs text-muted-foreground">Štucin</p>
          {user?.email && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {admin ? 'Admin' : 'Delavec'} · {user.email}
            </p>
          )}
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>
        <NotificationToggle />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-foreground/70 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Odjava
        </Button>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div>
            <h1 className="font-display text-lg font-bold">Rent modul</h1>
            {user?.email && (
              <p className="text-xs text-muted-foreground">{admin ? 'Admin' : 'Delavec'}</p>
            )}
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h1 className="font-display text-xl font-bold">Rent modul</h1>
                </div>
                <nav className="flex-1 space-y-1">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
                <NotificationToggle />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-foreground/70 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Odjava
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
