import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-brand opacity-[0.03]" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Tecnologia para o Bem Social</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Transformando
              <br />
              <span className="text-gradient">ONGs</span> com
              <br />
              tecnologia
            </h1>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg">
              Conectamos organizações beneficentes com projetos de apoio tecnológico, 
              capacitando entidades para ampliar seu impacto e transformar comunidades.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={createPageUrl("Projects")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-200/50"
              >
                Ver Projetos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={createPageUrl("Organizations")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
              >
                Conheça as Organizações
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-brand rounded-3xl opacity-10 blur-2xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&h=500&fit=crop"
                alt="Equipe trabalhando"
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">150+</p>
                    <p className="text-xs text-slate-500">Projetos Realizados</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}