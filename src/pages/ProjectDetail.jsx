import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowLeft, Building2, Calendar, Users, DollarSign, Target, Cpu, Clock, Edit, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectForm from "@/components/projects/ProjectForm";
import moment from "moment";

const STATUS_STYLES = {
  "Proposta": "bg-slate-50 text-slate-600",
  "Em Andamento": "bg-blue-50 text-blue-700",
  "Concluído": "bg-emerald-50 text-emerald-700",
  "Pausado": "bg-amber-50 text-amber-700",
};

const UPDATE_TYPE_STYLES = {
  "Progresso": "bg-blue-50 text-blue-700",
  "Marco Alcançado": "bg-emerald-50 text-emerald-700",
  "Necessidade": "bg-amber-50 text-amber-700",
  "Resultado": "bg-violet-50 text-violet-700",
};

export default function ProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const [project, setProject] = useState(null);
  const [org, setOrg] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: "", content: "", update_type: "Progresso" });
  const [savingUpdate, setSavingUpdate] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const p = await base44.entities.Project.list();
    const found = p.find((x) => x.id === projectId);
    setProject(found);
    if (found?.organization_id) {
      const orgList = await base44.entities.Organization.list();
      setOrg(orgList.find((o) => o.id === found.organization_id));
    }
    const allUpdates = await base44.entities.ProjectUpdate.list("-created_date");
    setUpdates(allUpdates.filter((u) => u.project_id === projectId));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [projectId]);

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    setSavingUpdate(true);
    await base44.entities.ProjectUpdate.create({ ...updateForm, project_id: projectId });
    setSavingUpdate(false);
    setShowUpdateForm(false);
    setUpdateForm({ title: "", content: "", update_type: "Progresso" });
    loadData();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-100 rounded w-1/4" />
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="h-40 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <p className="text-slate-500">Projeto não encontrado</p>
        <Link to={createPageUrl("Projects")} className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
          Voltar para Projetos
        </Link>
      </div>
    );
  }

  const budgetPercent = project.budget_estimated > 0 ? Math.round((project.budget_raised / project.budget_estimated) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Back */}
      <Link to={createPageUrl("Projects")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar para Projetos
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {project.cover_image_url && (
          <div className="h-56 overflow-hidden">
            <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={STATUS_STYLES[project.status]}>{project.status}</Badge>
                <Badge variant="secondary">{project.priority}</Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">{project.title}</h1>
              {org && (
                <p className="text-slate-500 mt-2 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> {org.name}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} className="shrink-0">
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed">{project.description}</p>

          {project.objectives && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-emerald-600" /> Objetivos
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{project.objectives}</p>
            </div>
          )}

          {/* Technologies */}
          {project.technologies?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <Cpu className="h-4 w-4 text-emerald-600" /> Tecnologias
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {project.start_date && (
              <div className="bg-slate-50 rounded-xl p-4">
                <Calendar className="h-4 w-4 text-slate-400 mb-2" />
                <p className="text-xs text-slate-400">Período</p>
                <p className="text-sm font-semibold text-slate-900">
                  {moment(project.start_date).format("MMM/YY")}
                  {project.end_date && ` – ${moment(project.end_date).format("MMM/YY")}`}
                </p>
              </div>
            )}
            {project.volunteers_needed > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <Users className="h-4 w-4 text-slate-400 mb-2" />
                <p className="text-xs text-slate-400">Voluntários</p>
                <p className="text-sm font-semibold text-slate-900">
                  {project.volunteers_joined || 0} / {project.volunteers_needed}
                </p>
              </div>
            )}
            {project.budget_estimated > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <DollarSign className="h-4 w-4 text-slate-400 mb-2" />
                <p className="text-xs text-slate-400">Orçamento</p>
                <p className="text-sm font-semibold text-slate-900">
                  R$ {project.budget_estimated?.toLocaleString("pt-BR")}
                </p>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-4">
              <Clock className="h-4 w-4 text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">Progresso</p>
              <p className="text-sm font-semibold text-slate-900">{project.progress || 0}%</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={project.progress || 0} className="h-2" />
          </div>

          {project.budget_estimated > 0 && project.budget_raised > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Arrecadado</span>
                <span>R$ {project.budget_raised?.toLocaleString("pt-BR")} ({budgetPercent}%)</span>
              </div>
              <Progress value={budgetPercent} className="h-1.5" />
            </div>
          )}
        </div>
      </div>

      {/* Updates */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Atualizações</h2>
          <Button onClick={() => setShowUpdateForm(true)} variant="outline" size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>

        {updates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <p className="text-slate-400 text-sm">Nenhuma atualização registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={UPDATE_TYPE_STYLES[update.update_type] || "bg-slate-50 text-slate-600"}>{update.update_type}</Badge>
                  <span className="text-xs text-slate-400">{moment(update.created_date).format("DD/MM/YYYY HH:mm")}</span>
                </div>
                <h4 className="font-semibold text-slate-900">{update.title}</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{update.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Projeto</DialogTitle></DialogHeader>
          <ProjectForm editData={project} onSuccess={() => { setShowEdit(false); loadData(); }} onCancel={() => setShowEdit(false)} />
        </DialogContent>
      </Dialog>

      {/* Update Form Dialog */}
      <Dialog open={showUpdateForm} onOpenChange={setShowUpdateForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Atualização</DialogTitle></DialogHeader>
          <form onSubmit={handleAddUpdate} className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} required className="mt-1" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={updateForm.update_type} onValueChange={(v) => setUpdateForm({ ...updateForm, update_type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Progresso", "Marco Alcançado", "Necessidade", "Resultado"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Conteúdo *</Label>
              <Textarea value={updateForm.content} onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })} required rows={4} className="mt-1" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowUpdateForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={savingUpdate} className="gradient-brand text-white">
                {savingUpdate && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Publicar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}