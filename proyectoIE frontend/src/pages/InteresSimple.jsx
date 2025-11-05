"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { Calculator, DollarSign, Percent, Clock, TrendingUp } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function InteresSimple() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [capital, setCapital] = useState("")
  const [tasa, setTasa] = useState("")
  const [tiempo, setTiempo] = useState("")
  const [monto, setMonto] = useState("")
  const [modo, setModo] = useState("")
  const { addRecord } = useRecords() // Declare the variable here

  async function send() {
    const body = {
      valorPresente: capital === "" ? null : Number(capital),
      tasaInteres: tasa === "" ? null : Number(tasa),
      tiempo: tiempo === "" ? null : Number(tiempo),
      valorFinal: monto === "" ? null : Number(monto),
      modo: modo,
    }
    const res = await api.post(path("/simple"), body)
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
        category: "Interés Simple",
        inputs: {
          capital: Number(capital || 0),
          tasa: Number(tasa || 0),
          tiempo: Number(tiempo || 0),
          modo: modo,
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
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Calculator size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Interés Simple</h1>
          <p className="text-slate-400">Calcula el interés simple para inversiones y préstamos</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Capital Inicial (VP)
            </label>
            <input
              className="input"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 1000000"
            />
            {capital && <div className="text-sm text-emerald-400 mt-1 currency">{formatCurrency(capital)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Percent size={16} className="text-blue-400" />
              Tasa de Interés (decimal)
            </label>
            <input
              className="input"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 0.12 (12%)"
            />
            {tasa && <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasa) * 100)}% anual</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Clock size={16} className="text-purple-400" />
              Tiempo (años)
            </label>
            <input
              className="input"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 2"
            />
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-400" />
              Monto Final (VF)
            </label>
            <input
              className="input"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 1240000"
            />
            {monto && <div className="text-sm text-orange-400 mt-1 currency">{formatCurrency(monto)}</div>}
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular Interés Simple"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <Calculator size={20} />
            Resultados del Cálculo
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "valorPresente"
                    ? "Capital Inicial"
                    : key === "tasaInteres"
                      ? "Tasa de Interés"
                      : key === "tiempo"
                        ? "Tiempo"
                        : key === "valorFinal"
                          ? "Monto Final"
                          : key === "interes"
                            ? "Interés Ganado"
                            : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "tasaInteres"
                    ? `${formatNumber(value * 100)}%`
                    : key === "tiempo"
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
