"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { Banknote, ArrowRightLeft, DollarSign, Percent, Calendar } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function UVR() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [modo, setModo] = useState("conversion")
  const [valor, setValor] = useState("")
  const [uvrActual, setUvrActual] = useState("")
  const [tipoConv, setTipoConv] = useState("uvr-a-pesos")
  const [ipc, setIpc] = useState("")
  const [dias, setDias] = useState("")

  const { addRecord } = useRecords()

  async function send() {
    if (modo === "conversion") {
      const body = { valor: Number(valor || 0), uvrActual: Number(uvrActual || 0), tipo: tipoConv }
      const res = await api.post(path("/uvr"), body)
      return res.data
    } else {
      const body = { uvrActual: Number(uvrActual || 0), ipc: Number(ipc || 0), dias: Number(dias || 0) }
      const res = await api.post(path("/uvr/futura"), body)
      return res.data
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

      if (modo === "conversion") {
        addRecord({
          category: "UVR",
          inputs: {
            valor: Number(valor || 0),
            uvrActual: Number(uvrActual || 0),
            tipo: tipoConv,
          },
          results: data,
        })
      } else {
        addRecord({
          category: "UVR",
          inputs: {
            uvrActual: Number(uvrActual || 0),
            ipc: Number(ipc || 0),
            dias: Number(dias || 0),
          },
          results: data,
        })
      }
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
        <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
          <Banknote size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">UVR (Unidad de Valor Real)</h1>
          <p className="text-slate-400">Conversiones y cálculos con la unidad monetaria colombiana</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card space-y-6">
        <div>
          <label className="label flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-purple-400" />
            Tipo de Operación
          </label>
          <select className="select" value={modo} onChange={(e) => setModo(e.target.value)}>
            <option value="conversion">Conversión UVR ↔ Pesos</option>
            <option value="futura">Cálculo UVR Futura</option>
          </select>
          <div className="text-sm text-purple-400 mt-1">
            {modo === "conversion" ? "Convierte entre UVR y pesos colombianos" : "Proyecta UVR futura con IPC"}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label flex items-center gap-2">
              <Banknote size={16} className="text-amber-400" />
              UVR Actual
            </label>
            <input
              className="input"
              value={uvrActual}
              onChange={(e) => setUvrActual(e.target.value)}
              type="number"
              step="any"
              placeholder="Ej: 350.25"
            />
            {uvrActual && <div className="text-sm text-amber-400 mt-1">{formatNumber(uvrActual)} UVR</div>}
          </div>

          {modo === "conversion" ? (
            <>
              <div>
                <label className="label flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  Valor a Convertir
                </label>
                <input
                  className="input"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  type="number"
                  step="any"
                  placeholder="Ej: 1000000"
                />
                {valor && (
                  <div className="text-sm text-emerald-400 mt-1">
                    {tipoConv === "uvr-a-pesos" ? `${formatNumber(valor)} UVR` : formatCurrency(valor)}
                  </div>
                )}
              </div>
              <div>
                <label className="label flex items-center gap-2">
                  <ArrowRightLeft size={16} className="text-blue-400" />
                  Dirección de Conversión
                </label>
                <select className="select" value={tipoConv} onChange={(e) => setTipoConv(e.target.value)}>
                  <option value="uvr-a-pesos">UVR → Pesos</option>
                  <option value="pesos-a-uvr">Pesos → UVR</option>
                </select>
                <div className="text-sm text-blue-400 mt-1">
                  {tipoConv === "uvr-a-pesos" ? "Convierte UVR a pesos" : "Convierte pesos a UVR"}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label flex items-center gap-2">
                  <Percent size={16} className="text-red-400" />
                  IPC (%)
                </label>
                <input
                  className="input"
                  value={ipc}
                  onChange={(e) => setIpc(e.target.value)}
                  type="number"
                  step="any"
                  placeholder="Ej: 3.5"
                />
                {ipc && <div className="text-sm text-red-400 mt-1">{formatNumber(ipc)}% IPC anual</div>}
              </div>
              <div>
                <label className="label flex items-center gap-2">
                  <Calendar size={16} className="text-cyan-400" />
                  Días de Proyección
                </label>
                <input
                  className="input"
                  value={dias}
                  onChange={(e) => setDias(e.target.value)}
                  type="number"
                  placeholder="Ej: 365"
                />
                {dias && <div className="text-sm text-cyan-400 mt-1">{formatNumber(dias)} días</div>}
              </div>
            </>
          )}
        </div>

        <button type="submit" className={`btn w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Calculando..." : modo === "conversion" ? "Convertir" : "Calcular UVR Futura"}
        </button>
      </form>

      {result !== null && (
        <div className="result-card">
          <h3 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <Banknote size={20} />
            Resultados UVR
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="metric-card">
                <div className="text-sm text-slate-400 mb-1">
                  {key === "uvrActual"
                    ? "UVR Actual"
                    : key === "valor"
                      ? "Valor Original"
                      : key === "resultado"
                        ? "Resultado"
                        : key === "uvrFutura"
                          ? "UVR Futura"
                          : key === "ipc"
                            ? "IPC"
                            : key === "dias"
                              ? "Días"
                              : key}
                </div>
                <div className="text-lg font-semibold text-slate-100">
                  {key === "ipc"
                    ? `${formatNumber(value)}%`
                    : key === "dias"
                      ? `${formatNumber(value)} días`
                      : key === "uvrActual" || key === "uvrFutura"
                        ? `${formatNumber(value)} UVR`
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
