"use client"

import { useState } from "react"
import { formatNumber } from "../lib/utils.js"
import { Shield, TrendingDown, BarChart } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function TasaReal() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [tir, setTir] = useState("")
  const [inflacion, setInflacion] = useState("")

  const { addRecord } = useRecords()

  async function send() {
    const body = { tir: Number(tir || 0), inflacion: Number(inflacion || 0) }
    const tasaReal = (1 + Number(tir || 0)) / (1 + Number(inflacion || 0)) - 1
    return {
      tir: Number(tir || 0),
      inflacion: Number(inflacion || 0),
      tasaReal: tasaReal,
      poderAdquisitivo: 1 / (1 + Number(inflacion || 0)),
    }
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
        category: "Tasa Real",
        inputs: {
          tir: Number(tir || 0),
          inflacion: Number(inflacion || 0),
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
        <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tasa Real</h1>
          <p className="text-slate-400">Ajusta la rentabilidad por el efecto de la inflación</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="label flex items-center gap-2">
              <BarChart size={16} className="text-emerald-400" />
              TIR / Tasa Nominal (decimal)
            </label>
            <input
              className="input"
              value={tir}
              onChange={(e) => setTir(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 0.15 (15%)"
            />
            {tir && <div className="text-sm text-emerald-400 mt-1">{formatNumber(Number(tir) * 100)}% nominal</div>}
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <TrendingDown size={16} className="text-red-400" />
              Tasa de Inflación (decimal)
            </label>
            <input
              className="input"
              value={inflacion}
              onChange={(e) => setInflacion(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 0.04 (4%)"
            />
            {inflacion && (
              <div className="text-sm text-red-400 mt-1">{formatNumber(Number(inflacion) * 100)}% inflación</div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Fórmula de Fisher:</h4>
          <div className="text-sm text-slate-400">Tasa Real = (1 + Tasa Nominal) / (1 + Inflación) - 1</div>
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : "Calcular Tasa Real"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-teal-400 mb-4 flex items-center gap-2">
            <Shield size={20} />
            Resultados del Ajuste por Inflación
          </h3>

          <div className="space-y-6">
            {/* Input Summary */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Datos de Entrada:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400">Tasa Nominal</div>
                  <div className="text-lg font-semibold text-emerald-400">{formatNumber(result.tir * 100)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Inflación</div>
                  <div className="text-lg font-semibold text-red-400">{formatNumber(result.inflacion * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Main Result */}
            <div className="bg-gradient-to-br from-teal-600/20 to-teal-800/20 rounded-xl p-6 border border-teal-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-lg text-teal-300 font-semibold">Tasa Real</div>
                  <div className="text-sm text-slate-400">Rentabilidad ajustada por inflación</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(result.tasaReal * 100)}%</div>
              <div className="text-sm text-slate-300">
                {result.tasaReal > 0
                  ? "✅ Rentabilidad positiva después de inflación"
                  : "⚠️ La inflación supera la rentabilidad"}
              </div>
            </div>

            {/* Additional Analysis */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={16} className="text-orange-400" />
                  <div className="text-sm font-medium text-slate-300">Poder Adquisitivo</div>
                </div>
                <div className="text-xl font-semibold text-orange-400">
                  {formatNumber(result.poderAdquisitivo * 100)}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Capacidad de compra relativa</div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart size={16} className="text-blue-400" />
                  <div className="text-sm font-medium text-slate-300">Diferencial</div>
                </div>
                <div className="text-xl font-semibold text-blue-400">
                  {formatNumber((result.tir - result.inflacion) * 100)}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Diferencia nominal vs inflación</div>
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Cálculo Aplicado:</h4>
              <div className="text-sm text-slate-400 space-y-1">
                <div>
                  Tasa Real = (1 + {formatNumber(result.tir * 100)}%) / (1 + {formatNumber(result.inflacion * 100)}%) -
                  1
                </div>
                <div>
                  Tasa Real = ({formatNumber(1 + result.tir, 4)}) / ({formatNumber(1 + result.inflacion, 4)}) - 1
                </div>
                <div className="text-teal-400 font-medium">Tasa Real = {formatNumber(result.tasaReal * 100)}%</div>
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
