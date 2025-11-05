"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatNumber } from "../lib/utils.js"
import { Activity, BarChart2, DollarSign } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function TIR() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [flujosTxt, setFlujosTxt] = useState("")

  async function send() {
    const arr = flujosTxt
      .split(/[\n,;]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => Number(t))
    const body = { flujos: arr }
    const res = await api.post(path("/tirsimple"), body)
    return res.data
  }

  const { addRecord } = useRecords()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)
    try {
      const data = await send()
      setResult(data)

      addRecord({
        category: "TIR Simple",
        inputs: {
          flujos: flujosTxt
            .split(/[\n,;]+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .map((t) => Number(t)),
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

  // Parse flujos para mostrar preview
  const flujos = flujosTxt
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => !isNaN(n))

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tasa Interna de Retorno (TIR)</h1>
          <p className="text-slate-400">Calcula la rentabilidad de proyectos de inversión</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div>
          <label className="label flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-400" />
            Flujos de Caja (separados por coma o nueva línea)
          </label>
          <textarea
            className="input min-h-[120px]"
            value={flujosTxt}
            onChange={(e) => setFlujosTxt(e.target.value)}
            placeholder="Ejemplo:&#10;-100000000&#10;30000000&#10;40000000&#10;50000000&#10;25000000"
          />
          <div className="text-sm text-slate-400 mt-2">
            <strong>Formato:</strong> El primer flujo debe ser negativo (inversión inicial). Los siguientes son los
            ingresos netos por período.
          </div>

          {flujos.length > 0 && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-300 mb-2">Vista previa de flujos:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {flujos.map((flujo, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${index === 0 ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"}`}
                  >
                    <div className="font-medium">Período {index}</div>
                    <div>${formatNumber(Math.abs(flujo))}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular TIR"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
            <BarChart2 size={20} />
            Resultados de la TIR
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "tir"
                    ? "TIR (%)"
                    : key === "vpn"
                      ? "VPN a TIR"
                      : key === "flujos"
                        ? "Número de Flujos"
                        : key === "inversion"
                          ? "Inversión Inicial"
                          : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "tir"
                    ? `${formatNumber(value)}%`
                    : key === "flujos" && Array.isArray(value)
                      ? `${value.length} períodos`
                      : typeof value === "number"
                        ? formatNumber(value)
                        : Array.isArray(value)
                          ? `${value.length} elementos`
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
