import { useEffect, useCallback } from 'react';
import { useRentals } from '@/hooks/useRentals';
import { useVehicles } from '@/hooks/useVehicles';

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

function showNotification(title: string, body: string, url: string = '/rent') {
  if (!('serviceWorker' in navigator)) {
    new Notification(title, { body, icon: '/logo-stucin.jpg' });
    return;
  }
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: '/logo-stucin.jpg',
      badge: '/logo-stucin.jpg',
      data: url,
    });
  });
}

function getNotificationPreference(email?: string): boolean {
  if (!email) return true;
  const key = `stucin-notifications-${email}`;
  const value = localStorage.getItem(key);
  return value === null ? true : value === '1';
}

export function setNotificationPreference(email: string, enabled: boolean): void {
  const key = `stucin-notifications-${email}`;
  localStorage.setItem(key, enabled ? '1' : '0');
}

export function useRentNotifications(userEmail?: string) {
  const { rentals } = useRentals();
  const { vehicles } = useVehicles();

  const checkAndNotify = useCallback(async () => {
    if (!getNotificationPreference(userEmail)) return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    const todayKey = formatDateKey(new Date());
    const todayReturns = rentals.filter(
      (r) =>
        r.status === 'active' &&
        r.rental.expectedReturnDate &&
        r.rental.expectedReturnDate.startsWith(todayKey)
    );

    if (todayReturns.length === 0) return;

    const lastNotifiedKey = `stucin-notified-${todayKey}`;
    if (localStorage.getItem(lastNotifiedKey)) return;

    const vehicleNames = todayReturns
      .map((r) => {
        const v = vehicles.find((vehicle) => vehicle.id === r.vehicleId);
        return v ? `${v.make} ${v.model} (${v.licensePlate})` : 'Neznano vozilo';
      })
      .join(', ');

    const title =
      todayReturns.length === 1
        ? 'Danes predvidena vrnitev vozila'
        : `Danes predvidene vrnitve (${todayReturns.length} vozil)`;
    const body = vehicleNames;

    showNotification(title, body, '/rent');
    localStorage.setItem(lastNotifiedKey, '1');
  }, [rentals, vehicles, userEmail]);

  useEffect(() => {
    checkAndNotify();

    const interval = setInterval(() => {
      checkAndNotify();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAndNotify]);

  return { requestPermission: requestNotificationPermission, enabled: getNotificationPreference(userEmail) };
}
