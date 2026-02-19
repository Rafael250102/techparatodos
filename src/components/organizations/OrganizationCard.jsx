import { Building2, MapPin, Users, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES = {
  "Ativa": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Inativa": "bg-slate-50 text-slate-600 border-slate-200",
  "Em Análise": "bg-amber-50 text-amber-700 border-amber-200",
};

const CATEGORY_COLORS = {
  "ONG": "bg-blue-50 text-blue-700",
  "Instituto": "bg-violet-50 text-violet-700",
  "Associação": "bg-rose-50 text-rose-700",
  "Fundação": "bg-teal-50 text-teal-700",
  "Coletivo": "bg-amber-50 text-amber-700",
};

export default function OrganizationCard({ org, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
          {org.logo_url ? (
            <img src={org.logo_url} alt={org.name} className="h-full w-full object-cover rounded-2xl" />
          ) : (
            <Building2 className="h-7 w-7 text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-emerald-700 transition-colors">
              {org.name}
            </h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[org.status] || STATUS_STYLES["Em Análise"]}`}>
              {org.status || "Em Análise"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={`text-xs ${CATEGORY_COLORS[org.category] || "bg-slate-100 text-slate-600"}`}>
              {org.category}
            </Badge>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500 line-clamp-2 leading-relaxed">{org.description}</p>

      <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
        {(org.city || org.state) && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {[org.city, org.state].filter(Boolean).join(", ")}
          </span>
        )}
        {org.people_impacted > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {org.people_impacted.toLocaleString("pt-BR")} impactados
          </span>
        )}
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            <Globe className="h-3.5 w-3.5" />
            Site
          </a>
        )}
      </div>

      {org.focus_areas?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {org.focus_areas.slice(0, 3).map((area) => (
            <span key={area} className="text-xs px-2 py-1 rounded-lg bg-slate-50 text-slate-600">{area}</span>
          ))}
          {org.focus_areas.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-lg bg-slate-50 text-slate-500">+{org.focus_areas.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}