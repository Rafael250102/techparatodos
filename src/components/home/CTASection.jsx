import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-brand p-12 lg:p-20 text-center"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur mb-8">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              Faça parte dessa
              <br />
              transformação social
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              Cadastre sua organização ou proponha um projeto tecnológico.
              Juntos podemos ampliar o impacto social através da tecnologia.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to={createPageUrl("Organizations")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Cadastrar Organização
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={createPageUrl("Projects")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Propor Projeto
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}