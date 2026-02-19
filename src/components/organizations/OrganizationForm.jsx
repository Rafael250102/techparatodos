import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["ONG", "Instituto", "Associação", "Fundação", "Coletivo"];
const FOCUS_AREAS = ["Educação", "Saúde", "Meio Ambiente", "Inclusão Digital", "Assistência Social", "Cultura", "Direitos Humanos", "Empreendedorismo Social"];

export default function OrganizationForm({ onSuccess, onCancel, editData }) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
    category: editData?.category || "",
    focus_areas: editData?.focus_areas || [],
    city: editData?.city || "",
    state: editData?.state || "",
    website: editData?.website || "",
    contact_email: editData?.contact_email || "",
    contact_phone: editData?.contact_phone || "",
    people_impacted: editData?.people_impacted || 0,
  });
  const [loading, setLoading] = useState(false);

  const toggleFocus = (area) => {
    setForm((prev) => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(area)
        ? prev.focus_areas.filter((a) => a !== area)
        : [...prev.focus_areas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (editData?.id) {
      await base44.entities.Organization.update(editData.id, form);
    } else {
      await base44.entities.Organization.create(form);
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nome da Organização *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
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
        <Label>Áreas de Atuação</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {FOCUS_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => toggleFocus(area)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                form.focus_areas.includes(area)
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {area}
              {form.focus_areas.includes(area) && <X className="h-3 w-3 inline ml-1" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Cidade</Label>
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Estado</Label>
          <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Email de Contato</Label>
          <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Website</Label>
          <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="mt-1" />
        </div>
        <div>
          <Label>Pessoas Impactadas</Label>
          <Input type="number" value={form.people_impacted} onChange={(e) => setForm({ ...form, people_impacted: parseInt(e.target.value) || 0 })} className="mt-1" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading} className="gradient-brand text-white">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {editData ? "Salvar Alterações" : "Cadastrar Organização"}
        </Button>
      </div>
    </form>
  );
}