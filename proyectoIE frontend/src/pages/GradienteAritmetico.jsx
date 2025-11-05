"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { TrendingUp, DollarSign, Plus, Percent, Hash } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function GradienteAritmetico() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [primerPago, setPrimerPago] = useState("")
  const [incremento, setIncremento] = useState("")
  const [tasa, setTasa] = useState("")
  const [periodos, setPeriodos] = useState("")
  const [modo, setModo] = useState("presente")

  const { addRecord } = useRecords()

  async function send() {
    const body = {
      primerPago: Number(primerPago || 0),
      incrementoPago: Number(incremento || 0),
      tasaInteres: Number(tasa || 0),
      periodos: Number(periodos || 0),
    }
    const res = await api.post(path(`/gradientes/${modo}`), body)
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
        category: "Gradiente Aritmético",
        inputs: {
          primerPago: Number(primerPago || 0),
          incrementoPago: Number(incremento || 0),
          tasaInteres: Number(tasa || 0),
          periodos: Number(periodos || 0),
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
        <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center">
          <TrendingUp size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Gradiente Aritmético</h1>
          <p className="text-slate-400">Calcula series de pagos con incremento constante por período</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Primer Pago (A₁)
            </label>
            <input
              className="input"
              value={primerPago}
              onChange={(e) => setPrimerPago(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 100000"
            />
            {primerPago && <div className="text-sm text-emerald-400 mt-1 currency">{formatCurrency(primerPago)}</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Plus size={16} className="text-blue-400" />
              Incremento por Período (G)
            </label>
            <input
              className="input"
              value={incremento}
              onChange={(e) => setIncremento(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 10000"
            />
            {incremento && (
              <div className="text-sm text-blue-400 mt-1 currency">+{formatCurrency(incremento)} cada período</div>
            )}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Percent size={16} className="text-purple-400" />
              Tasa de Interés (decimal)
            </label>
            <input
              className="input"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 0.08"
            />
            {tasa && (
              <div className="text-sm text-purple-400 mt-1">{formatNumber(Number(tasa) * 100)}% por período</div>
            )}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Hash size={16} className="text-orange-400" />
              Número de Períodos (n)
            </label>
            <input
              className="input"
              value={periodos}
              onChange={(e) => setPeriodos(e.target.value)}
              type="number"
              placeholder="Ej: 10"
            />
            {periodos && <div className="text-sm text-orange-400 mt-1">{formatNumber(periodos)} períodos</div>}
          </div>

          <div className="sm:col-span-2">
            <label className="label flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              Tipo de Cálculo
            </label>
            <select className="select" value={modo} onChange={(e) => setModo(e.target.value)}>
              <option value="presente">Valor Presente (VP)</option>
              <option value="futuro">Valor Futuro (VF)</option>
            </select>
            <div className="text-sm text-cyan-400 mt-1">
              {modo === "presente" ? "Valor actual de la serie" : "Valor acumulado al final"}
            </div>
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : `Calcular ${modo === "presente" ? "Valor Presente" : "Valor Futuro"}`}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Resultados del Gradiente Aritmético
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "primerPago"
                    ? "Primer Pago"
                    : key === "incrementoPago"
                      ? "Incremento"
                      : key === "tasaInteres"
                        ? "Tasa de Interés"
                        : key === "periodos"
                          ? "Períodos"
                          : key === "valorPresente"
                            ? "Valor Presente"
                            : key === "valorFuturo"
                              ? "Valor Futuro"
                              : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "tasaInteres"
                    ? `${formatNumber(value * 100)}%`
                    : key === "periodos"
                      ? `${formatNumber(value)} períodos`
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
