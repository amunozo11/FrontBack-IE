"use client"

import Sidebar from "./Sidebar.jsx"
import MobileNav from "./MobileNav.jsx"
import { useState } from "react"

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Interés Simple", path: "/interes-simple", icon: "Calculator" },
    { name: "Interés Compuesto", path: "/interes-compuesto", icon: "TrendingUp" },
    { name: "Anualidades", path: "/anualidades", icon: "CreditCard" },
    { name: "Amortización", path: "/amortizacion", icon: "Building2" },
    { name: "Gradiente Aritmético", path: "/gradiente-aritmetico", icon: "BarChart" },
    { name: "Gradiente Geométrico", path: "/gradiente-geometrico", icon: "BarChart3" },
    { name: "TIR Simple", path: "/tir", icon: "Activity" },
    // { name: "TIR Modificada", path: "/tirm", icon: "GitBranch" },
    // { name: "ROI Contable", path: "/roi", icon: "Target" },
    { name: "Tasa Real", path: "/tasa-real", icon: "Shield" },
    // { name: "Análisis Inflación", path: "/inflacion", icon: "TrendingDown" },
    // { name: "UVR", path: "/uvr", icon: "Banknote" },
    { name: "Historial", path: "/registros", icon: "History" },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Sidebar */}
      <Sidebar menuItems={menuItems} />

      {/* Mobile Navigation */}
      <MobileNav menuItems={menuItems} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <main className="md:ml-72 p-4 md:p-6 lg:p-8 space-y-2 md:space-y-8 overflow-auto min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
