import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Directrice Marketing",
    company: "Boulangerie Les Délices",
    content:
      "Je fais appel à Philippe et son équipe chaque année pour des opérations ponctuelles et thématiques en galerie comme le BLACK FRIDAY ou la fête des mères, les clients aiment jouer !",
    rating: 5,
  },
  {
    name: "Thomas Martin",
    role: "Gérant",
    company: "Sport Plus",
    content:
      "Le programme de fidélité gamifié a transformé nos clients occasionnels en habitués. Notre taux de rétention a bondi de 40%.",
    rating: 5,
  },
  {
    name: "Charlotte CHARLIER",
    role: "Responsable communication, animations",
    company: "Centre Commercial TEMPO",
    content:
      "L'équipe est réactive et créative. Nos animations en présentiel sont toujours un succès auprès de nos commerçants galerie.",
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
            Ce que disent nos <span className="gradient-text-accent">clients</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez les retours d'expérience de commerçants qui nous font confiance.
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
