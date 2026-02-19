import { motion } from "framer-motion";
import { Building2, FolderOpen, Users, Globe } from "lucide-react";

const stats = [
  { icon: Building2, label: "Organizações Apoiadas", value: "80+", color: "bg-emerald-50 text-emerald-600" },
  { icon: FolderOpen, label: "Projetos Ativos", value: "150+", color: "bg-blue-50 text-blue-600" },
  { icon: Users, label: "Voluntários", value: "500+", color: "bg-violet-50 text-violet-600" },
  { icon: Globe, label: "Pessoas Impactadas", value: "25K+", color: "bg-amber-50 text-amber-600" },
];

export default function ImpactStats() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl lg:text-4xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}