import { motion } from "framer-motion";
import { Monitor, Shield, GraduationCap, Database, Smartphone, Cloud } from "lucide-react";

const services = [
  {
    icon: Monitor,
    title: "Desenvolvimento Web",
    desc: "Sites e plataformas personalizadas para potencializar a presença digital da sua ONG.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Segurança Digital",
    desc: "Proteção de dados sensíveis e implementação de boas práticas de cibersegurança.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Capacitação Digital",
    desc: "Treinamentos e workshops para equipes e beneficiários em ferramentas tecnológicas.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Database,
    title: "Gestão de Dados",
    desc: "Sistemas inteligentes para organizar, analisar e reportar indicadores de impacto.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Smartphone,
    title: "Aplicativos Mobile",
    desc: "Soluções mobile para conectar beneficiários e facilitar a comunicação.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Cloud,
    title: "Infraestrutura Cloud",
    desc: "Migração e configuração de ambientes em nuvem acessíveis e escaláveis.",
    gradient: "from-cyan-500 to-sky-600",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 gradient-brand-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Nossos Serviços</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Soluções tecnológicas para
            <br />
            <span className="text-gradient">organizações sociais</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}