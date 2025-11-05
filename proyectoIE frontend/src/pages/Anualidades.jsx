"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { CreditCard, Percent, Hash, DollarSign, ToggleLeft } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function Anualidades() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [tasa, setTasa] = useState("")
  const [periodoPago, setPeriodoPago] = useState("")
  const [anualidad, setAnualidad] = useState("")
  const [modo, setModo] = useState("valorFinal")

  const { addRecord } = useRecords()

  async function send() {
    const body = {
      tasaAnualidad: tasa === "" ? null : Number(tasa),
      periodoPago: periodoPago === "" ? null : Number(periodoPago),
      anualidad: anualidad === "" ? null : Number(anualidad),
    }
    const url = modo === "valorFinal" ? "/anualidades/valorFinal" : "/anualidades/valorAtual"
    const res = await api.post(path(url), body)
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

      const formattedResults = {}

      if (data.valorFinal !== undefined && data.valorFinal !== null && isFinite(data.valorFinal)) {
        formattedResults.valorFinal = formatCurrency(data.valorFinal)
      }

      if (data.valorPresente !== undefined && data.valorPresente !== null && isFinite(data.valorPresente)) {
        formattedResults.valorPresente = formatCurrency(data.valorPresente)
      }

      // Calculate additional metrics
      const totalPagos = (data.anualidad || Number(anualidad)) * (data.periodoPago || Number(periodoPago))
      formattedResults.totalPagos = formatCurrency(totalPagos)

      if (data.valorFinal && isFinite(data.valorFinal)) {
        formattedResults.interesesGanados = formatCurrency(data.valorFinal - totalPagos)
      }

      addRecord({
        category: "Anualidades",
        inputs: {
          pago: formatCurrency(Number(anualidad || 0)),
          tasa: `${formatNumber(Number(tasa || 0) * 100)}%`,
          periodos: `${formatNumber(Number(periodoPago || 0))} períodos`,
          tipo: modo === "valorFinal" ? "Calcular Valor Final (VF)" : "Calcular Valor Presente (VP)",
          modo,
        },
        results: formattedResults,
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
        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
          <CreditCard size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Anualidades</h1>
          <p className="text-slate-400">Calcula el valor presente y futuro de series de pagos uniformes</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
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
              placeholder="Ej: 0.08 (8%)"
            />
            {tasa && <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasa) * 100)}% por período</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Hash size={16} className="text-green-400" />
              Número de Períodos (n)
            </label>
            <input
              className="input"
              value={periodoPago}
              onChange={(e) => setPeriodoPago(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 12"
            />
            {periodoPago && <div className="text-sm text-green-400 mt-1">{formatNumber(periodoPago)} períodos</div>}
          </div>

          <div className="sm:col-span-2">
            <label className="label flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Anualidad (A) - Pago por Período
            </label>
            <input
              className="input"
              value={anualidad}
              onChange={(e) => setAnualidad(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 100000"
            />
            {anualidad && (
              <div className="text-sm text-emerald-400 mt-1 currency">{formatCurrency(anualidad)} por período</div>
            )}
          </div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : `Calcular ${modo === "valorFinal" ? "Valor Final" : "Valor Presente"}`}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Resultados de Anualidades
          </h3>

          <div className="space-y-6">
            {/* Input Summary */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Datos de Entrada:</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400">Pago por Período</div>
                  <div className="text-lg font-semibold text-emerald-400">
                    {formatCurrency(result.anualidad || anualidad)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Tasa por Período</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {formatNumber((result.tasaAnualidad || tasa) * 100)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Número de Períodos</div>
                  <div className="text-lg font-semibold text-green-400">
                    {formatNumber(result.periodoPago || periodoPago)}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Results */}
            <div className="grid sm:grid-cols-2 gap-6">
              {result.valorFinal && (
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-300">Valor Final (VF)</div>
                      <div className="text-xs text-slate-400">Valor acumulado al final</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.valorFinal}</div>
                </div>
              )}

              {result.valorPresente && (
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-xl p-6 border border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-emerald-300">Valor Presente (VP)</div>
                      <div className="text-xs text-slate-400">Valor actual de los pagos</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.valorPresente}</div>
                </div>
              )}
            </div>

            {/* Additional Calculations */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Análisis Adicional:</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Total de Pagos: </span>
                  <span className="text-white font-medium">{result.totalPagos}</span>
                </div>
                {result.interesesGanados && (
                  <div>
                    <span className="text-slate-400">Intereses Ganados: </span>
                    <span className="text-green-400 font-medium">{result.interesesGanados}</span>
                  </div>
                )}
              </div>
            </div>
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
