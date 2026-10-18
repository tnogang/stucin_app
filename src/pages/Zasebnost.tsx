import { Helmet } from 'react-helmet-async';
import SeoHreflang from '@/components/SeoHreflang';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Zasebnost() {
  const { t } = useLanguage();
  const p = t.cookies?.policy;

  return (
    <>
      <Helmet>
        <title>{p?.title || 'Politika zasebnosti'} | Avtovleka Štucin</title>
      </Helmet>
      <SeoHreflang path="/zasebnost" />
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-8">
              {p?.title || 'Politika zasebnosti'}
            </h1>

            <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
              <p className="text-foreground/80">{p?.lastUpdated || 'Zadnja posodobitev: februar 2026'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.intro?.title || '1. Uvod'}</h2>
              <p>{p?.sections?.intro?.text || 'Martin Štucin s.p. (v nadaljevanju "mi") spoštuje vašo zasebnost. Ta politika pojasnjuje, kako zbiramo, uporabljamo in ščitimo vaše osebne podatke pri uporabi naše spletne strani.'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.dataCollection?.title || '2. Katere podatke zbiramo'}</h2>
              <p>{p?.sections?.dataCollection?.text || 'Zbiramo podatke, ki nam jih posredujete preko kontaktnega obrazca (ime, e-naslov, sporočilo), ter tehnične podatke o uporabi spletne strani (piškotki, IP naslov, tip brskalnika).'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.cookies?.title || '3. Piškotki'}</h2>
              <p>{p?.sections?.cookies?.text || 'Naša spletna stran uporablja nujne piškotke za pravilno delovanje strani (shranjevanje jezikovnih nastavitev, soglasje za piškotke). Ne uporabljamo piškotkov za sledenje ali oglaševanje.'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.purpose?.title || '4. Namen obdelave'}</h2>
              <p>{p?.sections?.purpose?.text || 'Vaše podatke uporabljamo izključno za odgovarjanje na vaša povpraševanja, izboljšanje uporabniške izkušnje in zagotavljanje pravilnega delovanja spletne strani.'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.rights?.title || '5. Vaše pravice'}</h2>
              <p>{p?.sections?.rights?.text || 'V skladu z GDPR (Splošna uredba o varstvu podatkov) imate pravico do dostopa, popravka, izbrisa in prenosljivosti vaših podatkov. Za uveljavljanje pravic nas kontaktirajte na stucin.martin@gmail.com.'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.retention?.title || '6. Hramba podatkov'}</h2>
              <p>{p?.sections?.retention?.text || 'Osebne podatke hranimo le toliko časa, kolikor je potrebno za izpolnitev namena, za katerega so bili zbrani, ali kolikor zahteva zakonodaja.'}</p>

              <h2 className="font-display text-xl font-semibold text-foreground">{p?.sections?.contact?.title || '7. Kontakt'}</h2>
              <p>{p?.sections?.contact?.text || 'Za vprašanja glede zasebnosti nas kontaktirajte:'}</p>
              <ul className="list-none space-y-1">
                <li><strong className="text-foreground">Martin Štucin s.p.</strong></li>
                <li>Goriška cesta 6f, 5271 Vipava</li>
                <li>E-pošta: stucin.martin@gmail.com</li>
                <li>Telefon: +386 51 200 404</li>
              </ul>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
