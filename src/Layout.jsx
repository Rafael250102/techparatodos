import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useState, useEffect } from "react";
import { Heart, Menu, X, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { name: "Início", page: "Home" },
  { name: "Organizações", page: "Organizations" },
  { name: "Projetos", page: "Projects" },
  { name: "Dashboard", page: "Dashboard" },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPageName]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <style>{`
        :root {
          --primary: #059669;
          --primary-dark: #047857;
          --accent: #0f766e;
        }
        body { font-family: 'Inter', system-ui, sans-serif; }
        .gradient-brand { background: linear-gradient(135deg, #059669 0%, #0f766e 50%, #1e40af 100%); }
        .gradient-brand-soft { background: linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(15,118,110,0.05) 100%); }
        .text-gradient { background: linear-gradient(135deg, #059669, #1e40af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className={`text-lg font-bold tracking-tight ${scrolled ? "text-slate-900" : "text-slate-900"}`}>
                Impacto<span className="text-emerald-600">Tech</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPageName === item.page
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                  <div className="h-7 w-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.full_name || user.email}</span>
                </div>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Entrar
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    currentPageName === item.page
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className={currentPageName === "Home" ? "" : "pt-20 lg:pt-24"}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="text-lg font-bold">ImpactoTech</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conectando organizações beneficentes com soluções tecnológicas para ampliar seu impacto social.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">Navegação</h4>
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className="block text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-400">Contato</h4>
              <p className="text-slate-400 text-sm">contato@impactotech.org</p>
              <p className="text-slate-400 text-sm mt-1">Tecnologia a serviço do bem social</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} ImpactoTech. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}