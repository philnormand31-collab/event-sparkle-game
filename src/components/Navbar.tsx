import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MonitorSmartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navLinks = [
{ name: "Accueil", href: "#top", isTop: true },
{ name: "Services", href: "#services" },
{ name: "Comment ça marche", href: "#how-it-works" },
{ name: "Avantages", href: "#benefits" },
{ name: "Action", href: "#action" },
{ name: "À propos", href: "/a-propos", isPage: true }] as const;


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[number]) => {
    e.preventDefault();
    if ('isTop' in link && link.isTop) {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if ('isPage' in link && link.isPage) {
      navigate(link.href);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/" + link.href);
    } else {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté !");
  };

  return (
    <>
    <ContactDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4">

      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-accent">LUDI</span><span className="text-foreground">GAMI</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`hover:text-foreground transition-colors duration-300 text-sm font-medium cursor-pointer ${link.name === 'Action' ? 'text-accent font-bold' : 'text-muted-foreground'}`}>
                {link.name}
              </a>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)}>
              En savoir plus
            </Button>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4 mr-1" />
                Déconnexion
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2">

            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen &&
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 glass-card rounded-2xl p-6">

              <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { handleNavClick(e, link); setIsOpen(false); }}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base font-medium py-2 cursor-pointer">
                    {link.name}
                  </a>
              )}
                <Button variant="hero" size="lg" className="mt-4 w-full" onClick={() => { setBookingOpen(true); setIsOpen(false); }}>
                  Demander une démo
                </Button>
                {user && (
                  <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground hover:text-destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Déconnexion
                  </Button>
                )}
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.nav>
    </>
  );

};