import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["Infraestrutura de TI", "Desenvolvimento Web", "Capacitação Digital", "Automação de Processos", "Segurança da Informação", "Gestão de Dados", "Aplicativo Mobile", "Consultoria Tecnológica"];
const PRIORITIES = ["Alta", "Média", "Baixa"];
const TECHNOLOGIES = ["React", "Node.js", "Python", "WordPress", "Google Workspace", "Microsoft 365", "Redes e Infraestrutura", "Cloud Computing", "Banco de Dados", "Design UX/UI", "Cybersegurança", "IA e Machine Learning"];

export default function ProjectForm({ onSuccess, onCancel, editData }) {
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    organization_id: editData?.organization_id || "",
    category: editData?.category || "",
    priority: editData?.priority || "Média",
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    budget_estimated: editData?.budget_estimated || 0,
    volunteers_needed: editData?.volunteers_needed || 0,
    objectives: editData?.objectives || "",
    technologies: editData?.technologies || [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.entities.Organization.list().then(setOrgs);
  }, []);

  const toggleTech = (tech) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editData?.id) {
      await base44.entities.Project.update(editData.id, form);
    } else {
      await base44.entities.Project.create(form);
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label>Título do Projeto *</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Organização *</Label>
          <Select value={form.organization_id} onValueChange={(v) => setForm({ ...form, organization_id: v })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {orgs.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Categoria *</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Descrição *</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="mt-1" />
      </div>

      <div>
        <Label>Objetivos</Label>
        <Textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={2} className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Prioridade</Label>
          <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Data de Início</Label>
          <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Data de Término</Label>
          <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Orçamento Estimado (R$)</Label>
          <Input type="number" value={form.budget_estimated} onChange={(e) => setForm({ ...form, budget_estimated: parseFloat(e.target.value) || 0 })} className="mt-1" />
        </div>
        <div>
          <Label>Voluntários Necessários</Label>
          <Input type="number" value={form.volunteers_needed} onChange={(e) => setForm({ ...form, volunteers_needed: parseInt(e.target.value) || 0 })} className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Tecnologias</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {TECHNOLOGIES.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                form.technologies.includes(tech)
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {tech}
              {form.technologies.includes(tech) && <X className="h-3 w-3 inline ml-1" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading} className="gradient-brand text-white">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {editData ? "Salvar Alterações" : "Criar Projeto"}
        </Button>
      </div>
    </form>
  );
}