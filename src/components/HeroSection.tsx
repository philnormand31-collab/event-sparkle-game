import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog, BookingInfo } from "@/components/BookingDialog";
import { ContactDialog } from "@/components/ContactDialog";

export const HeroSection = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

  const handleBookingConfirm = (info: BookingInfo) => {
    setBookingInfo(info);
    setContactOpen(true);
  };

  return (
    <>
    <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} onConfirm={handleBookingConfirm} />
    <ContactDialog open={contactOpen} onOpenChange={setContactOpen} bookingInfo={bookingInfo} />
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full animate-pulse-glow"
        style={{ background: "var(--gradient-glow)" }} />

      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(ellipse at center, hsl(24 95% 53% / 0.1) 0%, transparent 70%)",
          animationDelay: "1.5s"
        }} />


      {/* Floating Elements */}
      <motion.div
        className="absolute top-32 right-20 hidden lg:block"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>

        <div className="glass-card p-4 rounded-2xl">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-20 hidden lg:block"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>

        <div className="glass-card p-4 rounded-2xl">
          <Zap className="w-8 h-8 text-primary" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">

          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">
            Leader de la gamification marketing
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">

          Quand vos clients{" "}
          <span className="gradient-text">s'amusent</span>, vos ventes{" "}
          <span className="gradient-text-accent">explosent</span> !
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-muted-foreground">Boostez le <span className="text-accent">trafic</span> de vos commerces et la <span className="text-accent">fidélité clients</span> grâce à nos <span className="text-accent">solutions digitales</span> et événements gamifiés <span className="text-accent">en présentiel</span>



        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Button variant="hero" size="xl" className="group" onClick={() => setBookingOpen(true)}>
            Une visio avec un pro ?
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="glass" size="xl" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
            Découvrez nos solutions
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">

          {[
          { value: "100%", label: "Personnalisable" },
          { value: "2M+", label: "Participants" },
          { value: "+45%", label: "Engagement client" },
          { value: "98%", label: "Satisfaction" }].
          map((stat, index) =>
          <div key={index} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text-accent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
    </>
  );

};
