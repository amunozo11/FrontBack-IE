"use client"

import { useState } from "react"
import { useRecords } from "../context/RecordsContext.jsx"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import {
  History,
  Calculator,
  TrendingUp,
  CreditCard,
  Building2,
  Target,
  Activity,
  GitBranch,
  BarChart3,
  TrendingDown,
  Shield,
  Banknote,
  Trash2,
  Filter,
  Calendar,
  Search,
} from "lucide-react"

const categoryIcons = {
  "Interés Simple": Calculator,
  "Interés Compuesto": TrendingUp,
  Anualidades: CreditCard,
  Amortización: Building2,
  "ROI Contable": Target,
  "TIR Simple": Activity,
  "TIR Modificada": GitBranch,
  "Gradiente Aritmético": TrendingUp,
  "Gradiente Geométrico": BarChart3,
  Inflación: TrendingDown,
  "Tasa Real": Shield,
  UVR: Banknote,
}

const categoryColors = {
  "Interés Simple": "emerald",
  "Interés Compuesto": "blue",
  Anualidades: "purple",
  Amortización: "indigo",
  "ROI Contable": "green",
  "TIR Simple": "red",
  "TIR Modificada": "cyan",
  "Gradiente Aritmético": "yellow",
  "Gradiente Geométrico": "pink",
  Inflación: "red",
  "Tasa Real": "teal",
  UVR: "amber",
}

export default function Registros() {
  const { records, deleteRecord, clearAllRecords } = useRecords()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Get unique categories
  const categories = [...new Set(records.map((record) => record.category))].sort()

  // Filter and sort records
  const filteredRecords = records
    .filter((record) => {
      const matchesCategory = selectedCategory === "all" || record.category === selectedCategory
      const matchesSearch =
        searchTerm === "" ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(record.inputs).toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.timestamp) - new Date(a.timestamp)
      if (sortBy === "oldest") return new Date(a.timestamp) - new Date(b.timestamp)
      if (sortBy === "category") return a.category.localeCompare(b.category)
      return 0
    })

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderResultValue = (key, value) => {
    if (typeof value === "number") {
      if (key.toLowerCase().includes("tasa") || key.toLowerCase().includes("roi")) {
        return `${formatNumber(value * 100)}%`
      }
      if (key.toLowerCase().includes("periodo") || key.toLowerCase().includes("tiempo")) {
        return `${formatNumber(value)} períodos`
      }
      return formatCurrency(value)
    }
    return value?.toString() || "N/A"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-600 flex items-center justify-center">
          <History size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Historial de Cálculos</h1>
          <p className="text-slate-400">Revisa todos tus cálculos financieros realizados</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select className="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="category">Por categoría</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cálculos..."
                className="input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {records.length > 0 && (
            <button
              onClick={() => {
                if (confirm("¿Estás seguro de que quieres eliminar todos los registros?")) {
                  clearAllRecords()
                }
              }}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 size={16} />
              Limpiar Todo
            </button>
          )}
        </div>

        <div className="text-sm text-slate-400">
          Mostrando {filteredRecords.length} de {records.length} registros
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="card text-center py-12">
          <History size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {records.length === 0 ? "No hay registros aún" : "No se encontraron registros"}
          </h3>
          <p className="text-slate-400">
            {records.length === 0
              ? "Realiza algunos cálculos financieros para ver tu historial aquí"
              : "Intenta ajustar los filtros de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const IconComponent = categoryIcons[record.category] || Calculator
            const colorClass = categoryColors[record.category] || "slate"

            return (
              <div key={record.id} className="card hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${colorClass}-600 flex items-center justify-center`}>
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{record.category}</h3>
                      <p className="text-sm text-slate-400">{formatDate(record.timestamp)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Inputs */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Parámetros de Entrada</h4>
                    <div className="space-y-2">
                      {Object.entries(record.inputs).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                          <span className="text-slate-200">{renderResultValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Resultados</h4>
                    <div className="space-y-2">
                      {Object.entries(record.results).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                          <span className={`font-medium text-${colorClass}-400`}>{renderResultValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
