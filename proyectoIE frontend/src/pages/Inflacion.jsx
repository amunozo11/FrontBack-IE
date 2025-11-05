"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { TrendingDown, Percent, DollarSign, Clock, Calculator } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function Inflacion() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [tipo, setTipo] = useState("TASA REAL")
  const [tasaNominal, setTasaNominal] = useState("")
  const [tasaReal, setTasaReal] = useState("")
  const [tasaInflacion, setTasaInflacion] = useState("")
  const [valor, setValor] = useState("")
  const [periodos, setPeriodos] = useState("")

  const { addRecord } = useRecords()

  async function send() {
    const body = {
      tipo,
      tasaNominal: tasaNominal === "" ? null : Number(tasaNominal),
      tasaReal: tasaReal === "" ? null : Number(tasaReal),
      tasaInflacion: tasaInflacion === "" ? null : Number(tasaInflacion),
      valor: valor === "" ? null : Number(valor),
      periodos: periodos === "" ? null : Number(periodos),
    }
    const res = await api.post(path("/inflacion"), body)
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
        category: "Inflación",
        inputs: {
          tipo,
          tasaNominal: tasaNominal === "" ? null : Number(tasaNominal),
          tasaReal: tasaReal === "" ? null : Number(tasaReal),
          tasaInflacion: tasaInflacion === "" ? null : Number(tasaInflacion),
          valor: valor === "" ? null : Number(valor),
          periodos: periodos === "" ? null : Number(periodos),
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
        <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center">
          <TrendingDown size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Análisis de Inflación</h1>
          <p className="text-slate-400">Calcula el impacto de la inflación en tasas e inversiones</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <Calculator size={16} className="text-purple-400" />
              Tipo de Cálculo
            </label>
            <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option>TASA REAL</option>
              <option>TASA NOMINAL</option>
              <option>VALOR FUTURO</option>
              <option>VALOR PRESENTE</option>
            </select>
            <div className="text-sm text-purple-400 mt-1">
              {tipo === "TASA REAL" && "Calcula la tasa real descontando inflación"}
              {tipo === "TASA NOMINAL" && "Calcula la tasa nominal incluyendo inflación"}
              {tipo === "VALOR FUTURO" && "Proyecta valor considerando inflación"}
              {tipo === "VALOR PRESENTE" && "Descuenta valor por inflación"}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="label flex items-center gap-2">
                <Percent size={16} className="text-blue-400" />
                Tasa Nominal (decimal)
              </label>
              <input
                className="input"
                value={tasaNominal}
                onChange={(e) => setTasaNominal(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 0.12 (12%)"
              />
              {tasaNominal && (
                <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasaNominal) * 100)}% nominal</div>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Percent size={16} className="text-emerald-400" />
                Tasa Real (decimal)
              </label>
              <input
                className="input"
                value={tasaReal}
                onChange={(e) => setTasaReal(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 0.08 (8%)"
              />
              {tasaReal && (
                <div className="text-sm text-emerald-400 mt-1">{formatNumber(Number(tasaReal) * 100)}% real</div>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <TrendingDown size={16} className="text-red-400" />
                Tasa de Inflación (decimal)
              </label>
              <input
                className="input"
                value={tasaInflacion}
                onChange={(e) => setTasaInflacion(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 0.04 (4%)"
              />
              {tasaInflacion && (
                <div className="text-sm text-red-400 mt-1">{formatNumber(Number(tasaInflacion) * 100)}% inflación</div>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <DollarSign size={16} className="text-orange-400" />
                Valor (para VP/VF)
              </label>
              <input
                className="input"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
                step="any"
                placeholder="Ej: 1000000"
              />
              {valor && <div className="text-sm text-orange-400 mt-1 currency">{formatCurrency(valor)}</div>}
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" />
              Períodos (para VP/VF)
            </label>
            <input
              className="input"
              value={periodos}
              onChange={(e) => setPeriodos(e.target.value)}
              type="number"
              placeholder="Ej: 5"
            />
            {periodos && <div className="text-sm text-cyan-400 mt-1">{formatNumber(periodos)} períodos</div>}
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : `Calcular ${tipo}`}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
            <TrendingDown size={20} />
            Resultados del Análisis de Inflación
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "tasaNominal"
                    ? "Tasa Nominal"
                    : key === "tasaReal"
                      ? "Tasa Real"
                      : key === "tasaInflacion"
                        ? "Inflación"
                        : key === "valorFuturo"
                          ? "Valor Futuro"
                          : key === "valorPresente"
                            ? "Valor Presente"
                            : key === "periodos"
                              ? "Períodos"
                              : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "tasaNominal" || key === "tasaReal" || key === "tasaInflacion"
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
