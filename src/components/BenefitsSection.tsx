import { motion } from "framer-motion";
import { TrendingUp, Users, Heart, Database, Shield, Zap } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Augmentation de trafic et de C.A",
    description: "Attirez plus de visiteurs grâce à des campagnes ludiques et virales.",
  },
  {
    icon: Users,
    title: "Fidélisation renforcée",
    description: "Créez une relation durable avec vos clients via des récompenses engageantes.",
  },
  {
    icon: Heart,
    title: "Expérience mémorable",
    description: "Démarquez-vous avec des animations uniques qui marquent les esprits.",
  },
  {
    icon: Database,
    title: "Data clients enrichie",
    description: "Collectez des données qualifiées pour personnaliser vos communications.",
  },
  {
    icon: Shield,
    title: "100% RGPD compliant",
    description: "Toutes nos solutions respectent les normes de protection des données.",
  },
  {
    icon: Zap,
    title: "Déploiement rapide",
    description: "De l'idée au lancement de 5 à 10 jours selon la complexité du projet.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-background" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{ background: "var(--gradient-glow)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Pourquoi <span className="gradient-text">nous choisir</span> ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-4xl mx-auto text-center">
            Des résultats concrets pour votre établissement, soutenus par notre expertise du terrain de plus de 25 ans,<br />
            la méthodologie, la maîtrise des process techniques et du digital
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
