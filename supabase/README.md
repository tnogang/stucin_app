# Supabase Edge Function: Telegram obvestilo ob vrnitvi vozila

Ko se v tabeli `rental_orders` status izposoje spremeni na `returned`,
Postgres sprožilec (`rental_returned_notify`, prek `pg_net`) pokliče
Edge funkcijo `rental-returned-notify`, ki pošlje sporočilo na Telegram.

## Trenutno stanje (nameščeno 2026-07-21)

- Edge funkcija `rental-returned-notify` je objavljena na projektu
  `iqvulteitxflwpzdbjsx` (`verify_jwt = false`, zaščitena z glavo
  `x-rental-webhook-secret`).
- Skrivnosti so nastavljene: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
  `RENTAL_WEBHOOK_SECRET`.
- V bazi obstaja sprožilec `rental_returned_notify` na
  `public.rental_orders` (AFTER UPDATE), ki kliče funkcijo prek `pg_net`.

## Spremembe in ponovna objava

```bash
supabase link --project-ref iqvulteitxflwpzdbjsx
supabase functions deploy rental-returned-notify
```

Nastavitveni koraki (BotFather, chat ID, `supabase secrets set`) so že
opravljeni; ob ponovni namestitvi na drug projekt jih ponovi.

## SQL sprožilca (za referenco / ponovno namestitev)

```sql
create extension if not exists pg_net;

create or replace function public.notify_rental_returned() returns trigger
language plpgsql security definer as $$
begin
  if NEW.status = 'returned' and OLD.status is distinct from 'returned' then
    perform net.http_post(
      url := 'https://iqvulteitxflwpzdbjsx.supabase.co/functions/v1/rental-returned-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-rental-webhook-secret', '<RENTAL_WEBHOOK_SECRET>'
      ),
      body := jsonb_build_object(
        'type', 'UPDATE',
        'table', 'rental_orders',
        'schema', 'public',
        'record', to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      )
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists rental_returned_notify on public.rental_orders;

create trigger rental_returned_notify
  after update on public.rental_orders
  for each row execute function public.notify_rental_returned();
```

## Test

Funkcijo lahko preizkusiš ročno (brez dejanske vrnitve):

```bash
curl -X POST \
  https://iqvulteitxflwpzdbjsx.supabase.co/functions/v1/rental-returned-notify \
  -H "Content-Type: application/json" \
  -H "x-rental-webhook-secret: <RENTAL_WEBHOOK_SECRET>" \
  -d '{
    "type": "UPDATE",
    "table": "rental_orders",
    "schema": "public",
    "record": {
      "id": "test",
      "vehicle_id": "<id obstoječega vozila>",
      "status": "returned",
      "customer": {"fullName": "Test Stranka"},
      "rental": {"startKm": 10000, "returnKm": 10250, "actualReturnDate": "2026-07-21T17:30:00Z"},
      "condition": {"cleanIn": true, "damageNotesIn": ""}
    },
    "old_record": {"status": "active"}
  }'
```

Pričakovan odgovor: `{"sent":true}` in sporočilo v Telegramu.

Dnevniki funkcije: Dashboard → **Edge Functions → rental-returned-notify → Logs**.
Odgovori `pg_net` klicev: tabela `net._http_response` v bazi.
