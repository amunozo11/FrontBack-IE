"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatNumber } from "../lib/utils.js"
import { GitBranch, TrendingUp, TrendingDown, Percent, Hash } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function TIRM() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [posTxt, setPosTxt] = useState("")
  const [negTxt, setNegTxt] = useState("")
  const [tReinv, setTReinv] = useState("")
  const [tFin, setTFin] = useState("")
  const [periodos, setPeriodos] = useState("")

  const { addRecord } = useRecords()

  function parsePairArray(text) {
    if (!text) return []
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [monto, periodo] = line.split(/[,;\s]+/).map((x) => Number(x))
        return { monto, periodo: Number(periodo) }
      })
  }

  async function send() {
    const body = {
      flujosPositivos: parsePairArray(posTxt),
      flujosNegativos: parsePairArray(negTxt),
      tasaReinversion: Number(tReinv || 0),
      tasaFinanciamiento: Number(tFin || 0),
      periodos: Number(periodos || 0),
    }
    const res = await api.post(path("/tirmodificada"), body)
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
        category: "TIR Modificada",
        inputs: {
          flujosPositivos: parsePairArray(posTxt),
          flujosNegativos: parsePairArray(negTxt),
          tasaReinversion: Number(tReinv || 0),
          tasaFinanciamiento: Number(tFin || 0),
          periodos: Number(periodos || 0),
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
        <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center">
          <GitBranch size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">TIR Modificada (TIRM)</h1>
          <p className="text-slate-400">Calcula la TIR considerando tasas de reinversión y financiamiento</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              Flujos Positivos (una línea por flujo: monto,periodo)
            </label>
            <textarea
              className="input min-h-[120px]"
              value={posTxt}
              onChange={(e) => setPosTxt(e.target.value)}
              placeholder="Ejemplo:&#10;30000000,1&#10;40000000,2&#10;50000000,3"
            />
            <div className="text-sm text-emerald-400 mt-1">Ingresos del proyecto por período</div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <TrendingDown size={16} className="text-red-400" />
              Flujos Negativos (una línea por flujo: monto,periodo)
            </label>
            <textarea
              className="input min-h-[120px]"
              value={negTxt}
              onChange={(e) => setNegTxt(e.target.value)}
              placeholder="Ejemplo:&#10;100000000,0&#10;5000000,2"
            />
            <div className="text-sm text-red-400 mt-1">Inversiones y egresos del proyecto</div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label flex items-center gap-2">
                <Percent size={16} className="text-blue-400" />
                Tasa de Reinversión (decimal)
              </label>
              <input
                className="input"
                value={tReinv}
                onChange={(e) => setTReinv(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 0.10"
              />
              {tReinv && <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tReinv) * 100)}%</div>}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Percent size={16} className="text-orange-400" />
                Tasa de Financiamiento (decimal)
              </label>
              <input
                className="input"
                value={tFin}
                onChange={(e) => setTFin(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 0.08"
              />
              {tFin && <div className="text-sm text-orange-400 mt-1">{formatNumber(Number(tFin) * 100)}%</div>}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Hash size={16} className="text-purple-400" />
                Períodos Totales
              </label>
              <input
                className="input"
                value={periodos}
                onChange={(e) => setPeriodos(e.target.value)}
                type="number"
                placeholder="Ej: 5"
              />
              {periodos && <div className="text-sm text-purple-400 mt-1">{formatNumber(periodos)} períodos</div>}
            </div>
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular TIRM"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <GitBranch size={20} />
            Resultados de la TIRM
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "tirm"
                    ? "TIRM (%)"
                    : key === "tasaReinversion"
                      ? "Tasa Reinversión"
                      : key === "tasaFinanciamiento"
                        ? "Tasa Financiamiento"
                        : key === "periodos"
                          ? "Períodos"
                          : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "tirm" || key === "tasaReinversion" || key === "tasaFinanciamiento"
                    ? `${formatNumber(value)}%`
                    : key === "periodos"
                      ? `${formatNumber(value)} períodos`
                      : typeof value === "number"
                        ? formatNumber(value)
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
