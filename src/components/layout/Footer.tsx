import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const quickLinks = [
    { name: t.footer.links.towing, path: '/storitve' },
    { name: t.footer.links.service, path: '/storitve' },
    { name: t.footer.links.tires, path: '/storitve' },
    { name: t.footer.links.rental, path: '/storitve' },
    { name: t.footer.links.gallery, path: '/galerija' },
    { name: t.footer.links.contact, path: '/kontakt' },
  ];

  const services = [
    { name: t.footer.links.bodywork, path: '/storitve' },
    { name: t.footer.links.washing, path: '/storitve' },
    { name: t.footer.links.storage, path: '/storitve' },
    { name: t.footer.links.disposal, path: '/storitve' },
    { name: t.footer.links.rescue, path: '/storitve' },
  ];

  return (
    <footer className="section-dark pt-12 md:pt-16 pb-24 lg:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-tow-accent to-emergency flex items-center justify-center font-display font-bold text-white text-lg md:text-xl">
                Š
              </div>
              <div>
                <p className="font-display font-bold text-base md:text-lg text-white">Avtovleka Štucin</p>
                <p className="text-xs md:text-sm text-white/60">Martin Štucin s.p.</p>
              </div>
            </div>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              {t.footer.companyDesc}
            </p>
            <div className="flex items-center gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl bg-tow-muted border border-white/10">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-tow-accent/20 flex items-center justify-center">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-tow-accent" />
              </div>
              <div>
                <p className="text-xs text-white/60">{t.footer.call247}</p>
                <a href="tel:+38651200404" className="font-display font-bold text-sm md:text-base text-white hover:text-tow-accent transition-colors">
                  +386 51 200 404
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm md:text-base mb-4 md:mb-6">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-tow-accent transition-colors text-xs md:text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-tow-accent/50 group-hover:bg-tow-accent transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-white text-sm md:text-base mb-4 md:mb-6">{t.footer.services}</h3>
            <ul className="space-y-2 md:space-y-3">
              {services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-tow-accent transition-colors text-xs md:text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-tow-accent/50 group-hover:bg-tow-accent transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="font-display font-bold text-white text-sm md:text-base mb-4 md:mb-6">{t.footer.contactHours}</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-tow-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-xs md:text-sm">{t.footer.businessPremises}</p>
                  <p className="text-white text-xs md:text-sm">Goriška cesta 6f, 5271 Vipava</p>
                </div>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-tow-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-xs md:text-sm">{t.footer.emailLabel}</p>
                  <a href="mailto:stucin.martin@gmail.com" className="text-white text-xs md:text-sm hover:text-tow-accent transition-colors break-all">
                    stucin.martin@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-tow-accent mt-0.5 flex-shrink-0" />
                <div className="text-xs md:text-sm">
                  <p className="text-white/70 mb-1">{t.footer.workingHours}</p>
                  <p className="text-white"><span className="text-tow-accent font-semibold">{t.footer.towing}:</span> 24/7</p>
                  <p className="text-white/80">{t.footer.workshop}: {t.footer.workshopHours}</p>
                  <p className="text-white/60 text-xs">{t.footer.lunch}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs md:text-sm text-center md:text-left">
            © {currentYear} Martin Štucin s.p. {t.footer.allRightsReserved}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="https://tno.si/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tow-accent hover:text-white text-xs md:text-sm transition-colors"
            >
              Made by <span className="font-bold">tnoAI</span>
            </a>
            <Link to="/zasebnost" className="text-white/50 hover:text-tow-accent text-xs md:text-sm transition-colors">
              {t.cookies?.policy?.title || 'Politika zasebnosti'}
            </Link>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Goriška+cesta+6f,+5271+Vipava,+Slovenia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-tow-accent text-xs md:text-sm flex items-center gap-1 transition-colors"
            >
              {t.footer.openMap}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
