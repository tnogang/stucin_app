import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRentAuth } from '@/hooks/useRentAuth';
import { isAdmin } from '@/lib/roles';
import RentLoginPage from './RentLoginPage';
import RentLayout from './RentLayout';
import RentDashboard from './RentDashboard';
import VehicleListPage from './VehicleListPage';
import VehicleFormPage from './VehicleFormPage';
import RentalCreatePage from './RentalCreatePage';
import RentalDetailPage from './RentalDetailPage';
import RentalReturnPage from './RentalReturnPage';
import SignaturePage from './SignaturePage';
import RentalHistoryPage from './RentalHistoryPage';
import UsersPage from './UsersPage';

function RequireAuth() {
  const { user, loading } = useRentAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Nalaganje...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/rent/login" state={{ from: location }} replace />;
  }

  return (
    <RentLayout>
      <Outlet />
    </RentLayout>
  );
}

function RequireAdmin() {
  const { user, loading } = useRentAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Nalaganje...</p>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return <Navigate to="/rent" replace />;
  }

  return <Outlet />;
}

function LoginRedirect() {
  const { user, loading } = useRentAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/rent', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Nalaganje...</p>
      </div>
    );
  }

  return <RentLoginPage />;
}

export default function RentRouter() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Routes>
      <Route path="login" element={<LoginRedirect />} />
      <Route element={<RequireAuth />}>
        <Route index element={<RentDashboard />} />
        <Route path="vozila" element={<VehicleListPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="vozila/novo" element={<VehicleFormPage />} />
          <Route path="vozila/:id" element={<VehicleFormPage />} />
          <Route path="izposoja/nova" element={<RentalCreatePage />} />
          <Route path="uporabniki" element={<UsersPage />} />
        </Route>
        <Route path="izposoja/:id" element={<RentalDetailPage />} />
        <Route path="izposoja/:id/podpis" element={<SignaturePage />} />
        <Route path="izposoja/:id/vrnitev" element={<RentalReturnPage />} />
        <Route path="zgodovina" element={<RentalHistoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/rent" replace />} />
      </Routes>
    </>
  );
}
