import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Building2, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import OrganizationForm from "@/components/organizations/OrganizationForm";
import OrganizationDetail from "@/components/organizations/OrganizationDetail";

const CATEGORIES = ["Todas", "ONG", "Instituto", "Associação", "Fundação", "Coletivo"];

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const loadOrgs = async () => {
    setLoading(true);
    const data = await base44.entities.Organization.list("-created_date");
    setOrgs(data);
    setLoading(false);
  };

  useEffect(() => { loadOrgs(); }, []);

  const filtered = orgs.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Todas" || o.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Organizações</h1>
          <p className="text-slate-500 mt-1">Entidades cadastradas na plataforma</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gradient-brand text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Nova Organização
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar organizações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48 rounded-xl">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="mt-4 h-10 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhuma organização encontrada</p>
          <p className="text-slate-400 text-sm mt-1">Cadastre a primeira organização para começar</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((org) => (
            <OrganizationCard key={org.id} org={org} onClick={() => setSelectedOrg(org)} />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Organização</DialogTitle>
          </DialogHeader>
          <OrganizationForm
            onSuccess={() => { setShowForm(false); loadOrgs(); }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrg && <OrganizationDetail org={selectedOrg} onClose={() => setSelectedOrg(null)} onRefresh={loadOrgs} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}