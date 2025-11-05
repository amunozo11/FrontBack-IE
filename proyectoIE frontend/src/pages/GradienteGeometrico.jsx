"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { BarChart3, DollarSign, Percent, Hash, TrendingUp } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function GradienteGeometrico() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [primerPago, setPrimerPago] = useState("")
  const [tasa, setTasa] = useState("")
  const [tasaCrec, setTasaCrec] = useState("")
  const [periodos, setPeriodos] = useState("")
  const [modo, setModo] = useState("presente")

  const { addRecord } = useRecords()

  async function send() {
    const body = {
      primerPago: Number(primerPago),
      tasaInteres: Number(tasa),
      tasaCrecimiento: Number(tasaCrec),
      periodos: Number(periodos),
    }
    const res = await api.post(path(`/gradientegeometrico/${modo}`), body)
    return res.data
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!primerPago || !tasa || !tasaCrec || !periodos) {
      setError("Por favor, completa todos los campos antes de calcular.")
      return
    }

    setLoading(true)
    try {
      const data = await send()
      console.log("📊 Resultado recibido:", data)

      // Si el backend devuelve un número, lo envolvemos en un objeto
      const formatted =
        typeof data === "number"
          ? {
              primerPago: Number(primerPago),
              tasaInteres: Number(tasa),
              tasaCrecimiento: Number(tasaCrec),
              periodos: Number(periodos),
              [modo === "presente" ? "valorPresente" : "valorFuturo"]: data,
            }
          : data

      setResult(formatted)

      addRecord({
        category: "Gradiente Geométrico",
        inputs: { primerPago, tasa, tasaCrec, periodos, modo },
        results: formatted,
      })
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || "Error al procesar la solicitud.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Título */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center">
          <BarChart3 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Gradiente Geométrico</h1>
          <p className="text-slate-400">Calcula series de pagos con crecimiento porcentual constante</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={onSubmit} className="card space-y-6 bg-slate-800/70 p-6 rounded-2xl shadow-lg">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Primer Pago */}
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
            {primerPago && <div className="text-sm text-emerald-400 mt-1">{formatCurrency(primerPago)}</div>}
          </div>

          {/* Tasa de Interés */}
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
              placeholder="Ej: 0.08"
            />
            {tasa && <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasa) * 100)}% por período</div>}
          </div>

          {/* Tasa de Crecimiento */}
          <div>
            <label className="label flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-400" />
              Tasa de Crecimiento (g)
            </label>
            <input
              className="input"
              value={tasaCrec}
              onChange={(e) => setTasaCrec(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 0.05"
            />
            {tasaCrec && (
              <div className="text-sm text-purple-400 mt-1">{formatNumber(Number(tasaCrec) * 100)}% crecimiento</div>
            )}
          </div>

          {/* Períodos */}
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

          {/* Tipo de cálculo */}
          <div className="sm:col-span-2">
            <label className="label flex items-center gap-2">
              <BarChart3 size={16} className="text-cyan-400" />
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

      {/* Resultados */}
      {result && (
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-md">
          <h3 className="text-xl font-semibold text-pink-400 mb-6 flex items-center gap-2">
            <BarChart3 size={20} />
            Resultados del Gradiente Geométrico
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-slate-700 rounded-lg overflow-hidden">
              <thead className="bg-slate-700 text-slate-200">
                <tr>
                  <th className="px-4 py-2 border-b border-slate-600">Variable</th>
                  <th className="px-4 py-2 border-b border-slate-600">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {Object.entries(result).map(([key, value]) => {
                  const nombre =
                    key === "primerPago"
                      ? "Primer Pago (A₁)"
                      : key === "tasaInteres"
                        ? "Tasa de Interés"
                        : key === "tasaCrecimiento"
                          ? "Tasa de Crecimiento"
                          : key === "periodos"
                            ? "Períodos (n)"
                            : key === "valorPresente"
                              ? "Valor Presente (VP)"
                              : key === "valorFuturo"
                                ? "Valor Futuro (VF)"
                                : key

                  const valor =
                    key === "tasaInteres" || key === "tasaCrecimiento"
                      ? `${formatNumber(value * 100)}%`
                      : key === "periodos"
                        ? `${formatNumber(value)} períodos`
                        : typeof value === "number"
                          ? formatCurrency(value)
                          : value

                  return (
                    <tr key={key} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-4 py-2 font-medium text-slate-300">{nombre}</td>
                      <td className="px-4 py-2 text-slate-100">{valor}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
