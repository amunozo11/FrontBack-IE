"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { TrendingUp, DollarSign, Percent, Clock, BarChart3 } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function InteresCompuesto() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [capital, setCapital] = useState("")
  const [tasa, setTasa] = useState("")
  const [tiempo, setTiempo] = useState("")
  const [monto, setMonto] = useState("")
  const [capitalizacion, setCapitalizacion] = useState("")
  const [modo, setModo] = useState("")

  const { addRecord } = useRecords()

  async function send() {
    const body = {
      valorPresente: capital === "" ? null : Number(capital),
      tasaInteres: tasa === "" ? null : Number(tasa),
      tiempo: tiempo === "" ? null : Number(tiempo),
      valorFinal: monto === "" ? null : Number(monto),
      capitalizacion: capitalizacion === "" ? null : Number(capitalizacion),
      modo,
    }
    const res = await api.post(path("/compuesto"), body)
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
        category: "Interés Compuesto",
        inputs: {
          capital: Number(capital || 0),
          tasa: Number(tasa || 0),
          tiempo: Number(tiempo || 0),
          capitalizacion: Number(capitalizacion || 0),
          modo,
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
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
          <TrendingUp size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Interés Compuesto</h1>
          <p className="text-slate-400">Calcula el crecimiento exponencial de inversiones con capitalización</p>
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
            {tasa && (
              <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasa) * 100)}% anual compuesto</div>
            )}
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
              placeholder="Ej: 5"
            />
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <BarChart3 size={16} className="text-orange-400" />
              Monto Final (VF)
            </label>
            <input
              className="input"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 1762341"
            />
            {monto && <div className="text-sm text-orange-400 mt-1 currency">{formatCurrency(monto)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">Capitalización</label>
            <input
              className="input"
              value={capitalizacion}
              onChange={(e) => setCapitalizacion(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 4"
            />
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular Interés Compuesto"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Resultados del Cálculo Compuesto
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(result)
              .filter(([key]) => key !== "interesSimple")
              .map(([key, value]) => (
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
                              ? "Interés Compuesto"
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
