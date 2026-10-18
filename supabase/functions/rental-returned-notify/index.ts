// Supabase Edge Function: rental-returned-notify
// Called by a Database Webhook on UPDATE of public.rental_orders.
// Sends a Telegram message when a rental's status changes to 'returned'.

interface RentalWebhookPayload {
  type: string;
  table: string;
  schema: string;
  record: {
    id: string;
    vehicle_id: string;
    status: string;
    customer?: { fullName?: string; phone?: string };
    rental?: {
      startKm?: number;
      returnKm?: number;
      actualReturnDate?: string;
      fuelLevelIn?: number;
      fuelLevelOut?: number;
    };
    condition?: {
      cleanIn?: boolean;
      damageNotesIn?: string;
    };
  };
  old_record: { status?: string };
}

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
const WEBHOOK_SECRET = Deno.env.get('RENTAL_WEBHOOK_SECRET');
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function getVehicle(vehicleId: string): Promise<string> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return vehicleId;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/vehicles?id=eq.${vehicleId}&select=make,model,license_plate`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!res.ok) return vehicleId;
  const rows = await res.json();
  const v = rows?.[0];
  if (!v) return vehicleId;
  return `${v.make} ${v.model} (${v.license_plate})`;
}

function formatDate(iso?: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('sl-SI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Ljubljana',
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  // Shared-secret check so only our Database Webhook can trigger this
  if (WEBHOOK_SECRET && req.headers.get('x-rental-webhook-secret') !== WEBHOOK_SECRET) {
    return json({ error: 'unauthorized' }, 401);
  }

  let payload: RentalWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const { record, old_record } = payload;

  // Only react to the transition into 'returned'
  if (payload.table !== 'rental_orders' || record?.status !== 'returned') {
    return json({ skipped: true });
  }
  if (old_record?.status === 'returned') {
    return json({ skipped: true, reason: 'already returned' });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return json({ error: 'Telegram secrets not configured' }, 500);
  }

  const vehicleLabel = await getVehicle(record.vehicle_id);
  const r = record.rental ?? {};
  const c = record.condition ?? {};
  const driven =
    r.returnKm != null && r.startKm != null ? r.returnKm - r.startKm : null;
  const damage = c.damageNotesIn?.trim();

  const lines = [
    '🚐 <b>Vozilo vrnjeno</b>',
    '',
    `<b>Vozilo:</b> ${vehicleLabel}`,
    `<b>Stranka:</b> ${record.customer?.fullName ?? '-'}`,
    `<b>Vrnjeno:</b> ${formatDate(r.actualReturnDate)}`,
    `<b>Kilometrina:</b> ${r.returnKm ?? '-'} km` +
      (driven != null ? ` (prevoženih ${driven} km)` : ''),
    `<b>Čisto:</b> ${c.cleanIn === false ? 'Ne' : 'Da'}`,
    `<b>Opombe:</b> ${damage || 'Brez novih poškodb'}`,
  ];

  const tgRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
      }),
    }
  );

  if (!tgRes.ok) {
    const err = await tgRes.text();
    console.error('Telegram API error:', err);
    return json({ error: 'telegram failed', detail: err }, 502);
  }

  return json({ sent: true });
});
