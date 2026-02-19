import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FolderOpen, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";

const STATUSES = ["Todos", "Proposta", "Em Andamento", "Concluído", "Pausado"];
const CATEGORIES = ["Todas", "Infraestrutura de TI", "Desenvolvimento Web", "Capacitação Digital", "Automação de Processos", "Segurança da Informação", "Gestão de Dados", "Aplicativo Mobile", "Consultoria Tecnológica"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [orgs, setOrgs] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [category, setCategory] = useState("Todas");
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [projectData, orgData] = await Promise.all([
      base44.entities.Project.list("-created_date"),
      base44.entities.Organization.list(),
    ]);
    setProjects(projectData);
    const orgMap = {};
    orgData.forEach((o) => { orgMap[o.id] = o.name; });
    setOrgs(orgMap);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "Todos" || p.status === status;
    const matchCategory = category === "Todas" || p.category === category;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Projetos</h1>
          <p className="text-slate-500 mt-1">Projetos tecnológicos para organizações beneficentes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gradient-brand text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar projetos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-56 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-10 bg-slate-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Nenhum projeto encontrado</p>
          <p className="text-slate-400 text-sm mt-1">Crie o primeiro projeto para começar</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} orgName={orgs[project.organization_id]} />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Projeto</DialogTitle>
          </DialogHeader>
          <ProjectForm onSuccess={() => { setShowForm(false); loadData(); }} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}