"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Calculator,
  TrendingUp,
  PieChart,
  BarChart3,
  DollarSign,
  Percent,
  Target,
  Activity,
  CreditCard,
  Banknote,
  LineChart,
  LogOut,
  History,
} from "lucide-react"

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/interes-simple", label: "Interés Simple", icon: Calculator },
  { to: "/interes-compuesto", label: "Interés Compuesto", icon: TrendingUp },
  { to: "/anualidades", label: "Anualidades", icon: CreditCard },
  { to: "/amortizacion", label: "Amortización", icon: Banknote },
  { to: "/gradiente-aritmetico", label: "Gradiente Aritmético", icon: LineChart },
  { to: "/gradiente-geometrico", label: "Gradiente Geométrico", icon: Activity },
  { to: "/tir", label: "TIR", icon: Target },
  // { to: "/tirm", label: "TIR Modificada", icon: Percent },
  // { to: "/roi", label: "ROI Contable", icon: PieChart },
  { to: "/tasa-real", label: "Tasa Real", icon: DollarSign },
  // { to: "/inflacion", label: "Inflación", icon: TrendingUp },
  // { to: "/uvr", label: "UVR", icon: BarChart3 },
  { to: "/registros", label: "Historial", icon: History },
]

export default function Sidebar() {
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 w-72 shrink-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 p-6 flex-col shadow-2xl z-40">
      <div className="mb-8">
        <div className="text-2xl font-bold text-emerald-400 mb-2 tracking-wide">IE Calculator</div>
        <div className="text-sm text-slate-400">Ingeniería Económica Profesional</div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "hover:bg-slate-800/70 text-slate-300 hover:text-white"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>

        <div className="text-xs text-slate-500 text-center">© {new Date().getFullYear()} Ingeniería Económica</div>
      </div>
    </aside>
  )
}
