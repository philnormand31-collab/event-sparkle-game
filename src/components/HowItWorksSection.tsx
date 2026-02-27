import { motion } from "framer-motion";
import { MessageSquare, Palette, Rocket, BarChart3 } from "lucide-react";

const steps = [
{
  number: "01",
  icon: MessageSquare,
  title: "Consultation",
  description:
  "Nous discutons de votre projet en visio pour déterminer vos objectifs, vos contraintes et trouvons ensemble l'événement le plus adapté à votre établissement."
},
{
  number: "02",
  icon: Palette,
  title: "Conception",
  description:
  "Nous construisons votre jeu personnalisé, design et programmation, en studio grâce à notre plateforme dédiée..."
},
{
  number: "03",
  icon: Rocket,
  title: "Déploiement",
  description:
  "Préparation et envoi des éléments matériels sur site, aide à la mise en route si nécessaire, lancement de l'opération dans votre point de vente !"
},
{
  number: "04",
  icon: BarChart3,
  title: "Analyse",
  description:
  "Suivi en temps réel et en continu, intervention de notre équipe à distance sur votre programme si nécessaire, DATA en fin d'opération."
}];


export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20">

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Comment ça <span className="gradient-text-accent">marche</span> ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Un processus simple, rapide et efficace pour lancer votre événement digital en quelques jours seulement dans votre établissement !


          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative text-center">

                {/* Number Badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-card flex items-center justify-center border border-border/50 relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center font-display font-bold text-sm text-accent-foreground">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

};