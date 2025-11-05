"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { Target, DollarSign, TrendingUp, BarChart3 } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function ROI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [utilidad, setUtilidad] = useState("")
  const [inversion, setInversion] = useState("")
  const [ganancia, setGanancia] = useState("")
  const [costos, setCostos] = useState("")
  const [tiempo, setTiempo] = useState("")

  const { addRecord } = useRecords()

  async function send() {
    const body = { utilidadPromedioAnual: Number(utilidad || 0), inversionInicial: Number(inversion || 0) }
    const res = await api.post(path("/tircontable"), body)
    return res.data
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)
    try {
      const data = await send()
      setResult(data)

      addRecord({
        category: "ROI Contable",
        inputs: {
          inversion: Number(inversion || 0),
          ganancia: Number(ganancia || 0),
          costos: Number(costos || 0),
          tiempo: Number(tiempo || 0),
        },
        results: data,
      })
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || "Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
          <Target size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">ROI Contable</h1>
          <p className="text-slate-400">Calcula el retorno sobre la inversión basado en utilidades contables</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              Utilidad Promedio Anual
            </label>
            <input
              className="input"
              value={utilidad}
              onChange={(e) => setUtilidad(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 5000000"
            />
            {utilidad && (
              <div className="text-sm text-emerald-400 mt-1 currency">{formatCurrency(utilidad)} anuales</div>
            )}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <DollarSign size={16} className="text-blue-400" />
              Inversión Inicial
            </label>
            <input
              className="input"
              value={inversion}
              onChange={(e) => setInversion(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 25000000"
            />
            {inversion && <div className="text-sm text-blue-400 mt-1 currency">{formatCurrency(inversion)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">Ganancia</label>
            <input
              className="input"
              value={ganancia}
              onChange={(e) => setGanancia(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 10000000"
            />
            {ganancia && <div className="text-sm text-blue-400 mt-1 currency">{formatCurrency(ganancia)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">Costos</label>
            <input
              className="input"
              value={costos}
              onChange={(e) => setCostos(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 5000000"
            />
            {costos && <div className="text-sm text-blue-400 mt-1 currency">{formatCurrency(costos)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">Tiempo</label>
            <input
              className="input"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 3"
            />
            {tiempo && <div className="text-sm text-blue-400 mt-1">{formatNumber(tiempo)} años</div>}
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular ROI Contable"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Resultados del ROI Contable
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "utilidadPromedioAnual"
                    ? "Utilidad Anual"
                    : key === "inversionInicial"
                      ? "Inversión Inicial"
                      : key === "roi"
                        ? "ROI (%)"
                        : key === "tiempoRecuperacion"
                          ? "Tiempo de Recuperación"
                          : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "roi"
                    ? `${formatNumber(value)}%`
                    : key === "tiempoRecuperacion"
                      ? `${formatNumber(value)} años`
                      : typeof value === "number"
                        ? formatCurrency(value)
                        : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="error-card">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
