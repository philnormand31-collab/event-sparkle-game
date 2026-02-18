import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
{ name: "Services", href: "#services" },
{ name: "Comment ça marche", href: "#how-it-works" },
{ name: "Avantages", href: "#benefits" },
{ name: "Contact", href: "#contact" }];


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4">

      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MonitorSmartphone className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-accent">​GAMI</span><span className="text-foreground">UNJEU</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <a
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium">

                {link.name}
              </a>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg">
              Demander une démo
            </Button>
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
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base font-medium py-2">

                    {link.name}
                  </a>
              )}
                <Button variant="hero" size="lg" className="mt-4 w-full">
                  Demander une démo
                </Button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.nav>);

};