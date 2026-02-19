import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Calendar, Users, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import moment from "moment";

const STATUS_STYLES = {
  "Proposta": "bg-slate-50 text-slate-600 border-slate-200",
  "Em Andamento": "bg-blue-50 text-blue-700 border-blue-200",
  "Concluído": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pausado": "bg-amber-50 text-amber-700 border-amber-200",
};

const PRIORITY_STYLES = {
  "Alta": "bg-red-50 text-red-600",
  "Média": "bg-amber-50 text-amber-600",
  "Baixa": "bg-slate-50 text-slate-500",
};

const CATEGORY_ICONS = {
  "Infraestrutura de TI": "🖥️",
  "Desenvolvimento Web": "🌐",
  "Capacitação Digital": "📚",
  "Automação de Processos": "⚙️",
  "Segurança da Informação": "🔒",
  "Gestão de Dados": "📊",
  "Aplicativo Mobile": "📱",
  "Consultoria Tecnológica": "💡",
};

export default function ProjectCard({ project, orgName }) {
  return (
    <Link
      to={createPageUrl(`ProjectDetail?id=${project.id}`)}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 hover:-translate-y-1 block"
    >
      {/* Cover */}
      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl">{CATEGORY_ICONS[project.category] || "💻"}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[project.status] || STATUS_STYLES["Proposta"]}`}>
            {project.status || "Proposta"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-slate-400 mb-1">{orgName || "Organização"}</p>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
        </div>

        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{project.description}</p>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="secondary" className={`text-xs ${PRIORITY_STYLES[project.priority] || ""}`}>
            {project.priority || "Média"}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-slate-50">{project.category}</Badge>
        </div>

        {/* Progress */}
        {project.progress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Progresso</span>
              <span className="font-medium text-slate-600">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
          {project.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {moment(project.start_date).format("MMM YYYY")}
            </span>
          )}
          {project.volunteers_needed > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {project.volunteers_joined || 0}/{project.volunteers_needed}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}