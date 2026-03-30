import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Emma T.",
    role: "Directrice Marketing",
    company: "IRIS PROCREA",
    content:
      "J'organise régulièrement des événements comme le BLACK FRIDAY ou la Fête des mères avec LUDIGAMI en mode stand PLAYCORNER, c'est toujours un succès auprès de nos clients !",
    rating: 5,
  },
  {
    name: "Olivier G.",
    role: "DG agence",
    company: "VIVACITY",
    content:
      "Nous avons organisé un jeu WINGO pour l'un de nos partenaire qui a vraiment apprécié la méthode, avec un code à saisir en présentiel pour créer des lignes de WINGO, les clients sont revenus 3x plus en magasin sur la période",
    rating: 5,
  },
  {
    name: "Charlotte C.",
    role: "Responsable communication, animations",
    company: "Centre Commercial TEMPO",
    content:
      "L'équipe est réactive et créative. Nos animations en présentiel avec le système LIVECODE sont toujours un succès auprès de nos commerçants galerie chaque année.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />

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
            C'est toujours nos <span className="gradient-text-accent">clients</span> qui en parlent le mieux
          </h2>
          <p className="text-muted-foreground text-lg whitespace-nowrap">
            Découvrez quelques retours d'expérience de clients réguliers qui nous font confiance...
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card rounded-3xl p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
