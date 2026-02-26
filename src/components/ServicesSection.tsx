import { motion } from "framer-motion";
import { Smartphone, Users, Trophy, QrCode, ArrowUpRight, Monitor, TabletSmartphone } from "lucide-react";

const services = [
{
  icon: QrCode,
  title: "Event LIVECODE",
  titleRender: () => <>Event <span className="text-foreground">LIVE</span><span className="text-accent">CODE</span></>,
  description: "",
  features: [],
  gradient: "from-primary to-blue-400",
  compact: true,
  iconRender: () => (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Monitor className="w-14 h-14 text-white absolute inset-0" />
      <QrCode className="w-6 h-6 text-white relative -mt-1" />
    </div>
  )
},
{
  icon: Smartphone,
  title: "Event NUMERICODE",
  titleRender: () => <>Event <span className="text-foreground">NUMERI</span><span className="text-accent">CODE</span></>,
  description: "",
  features: [],
  gradient: "from-accent to-orange-400",
  compact: true,
  iconRender: () => (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Monitor className="w-14 h-14 text-white absolute inset-0" />
      <span className="text-white relative -mt-1 text-[11px] font-bold tracking-tight">385274</span>
    </div>
  )
},
{
  icon: Users,
  title: "Event MOBILPLAY",
  titleRender: () => <>Event <span className="text-foreground">MOBIL</span><span className="text-accent">PLAY</span></>,
  description: "",
  features: [],
  gradient: "from-emerald-500 to-teal-400",
  compact: true,
  iconRender: () => (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <Monitor className="w-14 h-14 text-white absolute inset-0" />
      <QrCode className="w-6 h-6 text-white relative -mt-1" />
      <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 flex gap-[6px]">
        <span className="w-[6px] h-[6px] rounded-full border-2 border-white/90" />
        <span className="w-[6px] h-[6px] rounded-full border-2 border-white/90" />
      </div>
    </div>
  )
},
{
  icon: Trophy,
  title: "Event PLAYCORNER",
  titleRender: () => <>Event <span className="text-foreground">PLAY</span><span className="text-accent">CORNER</span></>,
  description: "",
  features: [],
  gradient: "from-purple-500 to-pink-400",
  compact: true,
  iconRender: () => (
    <TabletSmartphone className="w-14 h-14 text-white" />
  )
}];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export const ServicesSection = () => {
  return (
    <section id="services" className="section-padding relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-accent">LUDI</span><span className="text-foreground">GAMI</span> se plie en <span className="gradient-text">quatre</span> pour la réussite de votre projet !
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Notre investissement est total dans la réussite de votre événement, découvrez nos propositions pour clarifier votre projet
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6">

          {services.map((service, index) =>
          <motion.div
            key={index}
            variants={cardVariants}
            className={`group glass-card rounded-3xl p-8 card-hover cursor-pointer relative overflow-hidden ${service.compact ? 'py-5' : ''}`}>

              {/* Gradient overlay on hover */}
              <div className="" />



              <div className="relative z-10">
                {service.compact ? (
                  <div className="flex items-center gap-5">
                    {/* Large Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shrink-0`}>
                      {service.iconRender ? service.iconRender() :
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <Smartphone className="w-14 h-14 text-white absolute inset-0" />
                          <QrCode className="w-6 h-6 text-white relative -mt-1" />
                          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex gap-[3px]">
                            <span className="w-[5px] h-[5px] rounded-full bg-white/80" />
                            <span className="w-[5px] h-[5px] rounded-full bg-white/80" />
                            <span className="w-[5px] h-[5px] rounded-full bg-white/80" />
                          </div>
                        </div>
                      }
                    </div>
                    {/* Title next to icon */}
                    <div className="flex items-center justify-between flex-1">
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        {service.titleRender ? service.titleRender() : service.title}
                      </h3>
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
                      <service.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        {service.titleRender ? service.titleRender() : service.title}
                      </h3>
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    </div>
                  </>
                )}

                {/* Description */}
                {service.description &&
              <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
              }

                {/* Features */}
                {service.features.length > 0 &&
              <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) =>
                <span
                  key={featureIndex}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-secondary/50 text-muted-foreground">

                        {feature}
                      </span>
                )}
                  </div>
              }
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

};