import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Building2, FolderOpen, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#059669", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"];

export default function Dashboard() {
  const [orgs, setOrgs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Organization.list(),
      base44.entities.Project.list("-created_date"),
    ]).then(([o, p]) => {
      setOrgs(o);
      setProjects(p);
      setLoading(false);
    });
  }, []);

  // Compute stats
  const totalImpacted = orgs.reduce((sum, o) => sum + (o.people_impacted || 0), 0);
  const totalVolunteers = projects.reduce((sum, p) => sum + (p.volunteers_joined || 0), 0);
  const activeProjects = projects.filter((p) => p.status === "Em Andamento").length;

  // Projects by status
  const statusCount = {};
  projects.forEach((p) => { statusCount[p.status || "Proposta"] = (statusCount[p.status || "Proposta"] || 0) + 1; });
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // Projects by category
  const catCount = {};
  projects.forEach((p) => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
  const catData = Object.entries(catCount).map(([name, value]) => ({ name: name?.length > 16 ? name.slice(0, 16) + "…" : name, value }));

  const stats = [
    { label: "Organizações", value: orgs.length, icon: Building2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Projetos", value: projects.length, icon: FolderOpen, color: "bg-blue-50 text-blue-600" },
    { label: "Projetos Ativos", value: activeProjects, icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
    { label: "Pessoas Impactadas", value: totalImpacted.toLocaleString("pt-BR"), icon: Users, color: "bg-amber-50 text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-100 rounded w-1/4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
            <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {/* Status Pie */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Projetos por Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} projetos`, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">Sem dados</p>
          )}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Projetos por Categoria</h3>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(v) => [`${v} projetos`]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-16">Sem dados</p>
          )}
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Projetos Recentes</h3>
          <Link to={createPageUrl("Projects")} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
            Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {projects.slice(0, 5).map((p) => (
            <Link
              key={p.id}
              to={createPageUrl(`ProjectDetail?id=${p.id}`)}
              className="flex items-center justify-between py-3 hover:bg-slate-50 px-3 rounded-lg -mx-3 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-400">{p.category}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                p.status === "Em Andamento" ? "bg-blue-50 text-blue-600" :
                p.status === "Concluído" ? "bg-emerald-50 text-emerald-600" :
                "bg-slate-50 text-slate-500"
              }`}>
                {p.status || "Proposta"}
              </span>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">Nenhum projeto cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
}