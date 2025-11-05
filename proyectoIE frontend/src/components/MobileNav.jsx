"use client"

import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Calculator,
  TrendingUp,
  CreditCard,
  Building2,
  BarChart,
  BarChart3,
  Activity,
  GitBranch,
  Target,
  Shield,
  TrendingDown,
  Banknote,
  History,
} from "lucide-react"

const iconMap = {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  CreditCard,
  Building2,
  BarChart,
  BarChart3,
  Activity,
  GitBranch,
  Target,
  Shield,
  TrendingDown,
  Banknote,
  History,
}

export default function MobileNav({ menuItems, isOpen, setIsOpen }) {
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-emerald-400">IE Calculator</div>
            <div className="text-xs text-slate-400">Ingeniería Económica</div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-slate-900/98 backdrop-blur-xl border-r border-slate-700/50 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          {/* Navigation */}
          <nav className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "hover:bg-slate-800/70 text-slate-300 hover:text-white"
                    }`
                  }
                >
                  {Icon && <Icon size={20} className="shrink-0" />}
                  <span className="font-medium text-sm">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
