import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/BookingDialog";

export const CTASection = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
    <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
        style={{ 
          background: "radial-gradient(ellipse at top center, hsl(24 95% 53% / 0.15) 0%, transparent 60%)" 
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              Démo gratuite & sans engagement
            </span>
          </motion.div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Prêt à <span className="gradient-text-accent">jouer</span> votre
            commerce ?
          </h2>

          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez les 500+ commerces qui ont déjà transformé leur relation
            client. Obtenez une démo personnalisée en 24h.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group w-full sm:w-auto" onClick={() => setBookingOpen(true)}>
              Réserver ma démo gratuite
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              Télécharger la brochure
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {["Carrefour", "Leclerc", "Auchan", "Casino", "Intermarché"].map(
                (brand, index) => (
                  <span
                    key={index}
                    className="font-display font-semibold text-muted-foreground"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
};