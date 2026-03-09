import { Building2, MapPin, Users, Globe, Mail, Phone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useState } from "react";

export default function OrganizationDetail({ org, onClose, onRefresh }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja remover "${org.name}"?`)) return;
    setDeleting(true);
    await base44.entities.Organization.delete(org.id);
    onRefresh?.();
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
          {org.logo_url ? (
            <img src={org.logo_url} alt={org.name} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-8 w-8 text-slate-400" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{org.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{org.category}</Badge>
            <Badge className={org.status === "Ativa" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
              {org.status || "Em Análise"}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed">{org.description}</p>

      {org.focus_areas?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Áreas de Atuação</h4>
          <div className="flex flex-wrap gap-2">
            {org.focus_areas.map((area) => (
              <span key={area} className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(org.city || org.state) && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {[org.city, org.state].filter(Boolean).join(", ")}
          </div>
        )}
        {org.people_impacted > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="h-4 w-4" />
            {org.people_impacted.toLocaleString("pt-BR")} pessoas impactadas
          </div>
        )}
        {org.contact_email && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="h-4 w-4" />
            {org.contact_email}
          </div>
        )}
        {org.contact_phone && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone className="h-4 w-4" />
            {org.contact_phone}
          </div>
        )}
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-600 hover:underline">
            <Globe className="h-4 w-4" />
            Visitar Website
          </a>
        )}
      </div>
    </div>
  );
}