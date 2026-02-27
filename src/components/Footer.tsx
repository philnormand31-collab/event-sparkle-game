import { MonitorSmartphone, Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";

const footerLinks = {
  services: [
  { name: "Event LIVECODE", href: "#services", serviceIndex: 0 },
  { name: "Event NUMERICODE", href: "#services", serviceIndex: 1 },
  { name: "Event MOBILPLAY", href: "#services", serviceIndex: 2 },
  { name: "Event PLAYCORNER", href: "#services", serviceIndex: 3 }],

  company: [
  { name: "À propos", href: "#" },
  { name: "Notre équipe", href: "#" },
  { name: "Carrières", href: "#" },
  { name: "Blog", href: "#" }],

  legal: [
  { name: "Mentions légales", href: "#" },
  { name: "CGV", href: "#" },
  { name: "Politique de confidentialité", href: "#" },
  { name: "Cookies", href: "#" }]

};

export const Footer = () => {
  return (
    <footer className="relative bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MonitorSmartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-accent">LUDI</span><span className="text-foreground">GAMI</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">Un programme propulsé par le groupe Animunjeu


            </p>
            <div className="space-y-3">
              <a href="mailto:contact@ludigami.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>contact@ludigami.com</span>
              </a>
              <a href="tel:+33608558612" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>06 08 55 86 12</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Toulouse, France</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) =>
              <li key={link.name}>
                  <button
                  onClick={() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-service', { detail: link.serviceIndex }));
                    }, 500);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">
                    {link.name}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Entreprise
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) =>
              <li key={link.name}>
                  <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm">

                    {link.name}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Légal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) =>
              <li key={link.name}>
                  <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm">

                    {link.name}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 LUDIGAMI. Tous droits réservés.

          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">

              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">

              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">

              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>);

};