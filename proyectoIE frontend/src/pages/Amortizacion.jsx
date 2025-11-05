"use client"

import { useState } from "react"
import api, { path } from "../lib/api.js"
import { formatCurrency, formatNumber } from "../lib/utils.js"
import { Building2, Percent, Hash, DollarSign, Settings, Table } from "lucide-react"
import { useRecords } from "../context/RecordsContext.jsx"

export default function Amortizacion() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const [monto, setMonto] = useState("")
  const [tasa, setTasa] = useState("")
  const [periodos, setPeriodos] = useState("")
  const [metodo, setMetodo] = useState("francesa")
  const [tipo, setTipo] = useState("préstamo")

  const { addRecord } = useRecords()

  async function send() {
    const body = { monto: Number(monto || 0), tasa: Number(tasa || 0), periodos: Number(periodos || 0) }
    const res = await api.post(path(`/amortizacion/${metodo}`), body)
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
        category: "Amortización",
        inputs: { monto: Number(monto || 0), tasa: Number(tasa || 0), periodos: Number(periodos || 0), tipo },
        results: {
          cuotaFija: data.cuotaFija,
          totalIntereses: data.totalIntereses,
          totalPagado: data.totalPagado,
          numeroTabla: data.tabla?.length || 0,
        },
      })
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || "Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* ENCABEZADO */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Building2 size={26} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Amortización</h1>
          <p className="text-slate-400">Calcula tablas de amortización para préstamos e hipotecas</p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={onSubmit} className="card bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormInput
            icon={<DollarSign size={16} className="text-emerald-400" />}
            label="Monto del Préstamo"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 50000000"
            suffix={monto && <div className="text-sm text-emerald-400 mt-1">{formatCurrency(monto)}</div>}
          />

          <FormInput
            icon={<Percent size={16} className="text-blue-400" />}
            label="Tasa de Interés (decimal)"
            value={tasa}
            onChange={(e) => setTasa(e.target.value)}
            placeholder="Ej: 0.015 (1.5% mensual)"
            suffix={
              tasa && (
                <div className="text-sm text-blue-400 mt-1">{formatNumber(Number(tasa) * 100)}% por período</div>
              )
            }
          />

          <FormInput
            icon={<Hash size={16} className="text-purple-400" />}
            label="Número de Períodos"
            value={periodos}
            onChange={(e) => setPeriodos(e.target.value)}
            placeholder="Ej: 60"
            suffix={
              periodos && <div className="text-sm text-purple-400 mt-1">{formatNumber(periodos)} cuotas</div>
            }
          />

          <FormSelect
            icon={<Settings size={16} className="text-orange-400" />}
            label="Método de Amortización"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            options={[
              { value: "francesa", text: "Francesa (Cuota Fija)" },
              { value: "americana", text: "Americana (Solo Intereses)" },
              { value: "alemana", text: "Alemana (Capital Fijo)" },
            ]}
            description={
              metodo === "francesa"
                ? "Cuotas iguales, interés y capital variables"
                : metodo === "americana"
                ? "Solo intereses, capital al final"
                : "Capital fijo, cuotas decrecientes"
            }
          />

          <FormSelect
            icon={<Settings size={16} className="text-orange-400" />}
            label="Tipo de Préstamo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={[
              { value: "préstamo", text: "Préstamo" },
              { value: "hipoteca", text: "Hipoteca" },
            ]}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all ${
            loading ? "opacity-70 cursor-wait" : ""
          }`}
        >
          <Table size={18} />
          {loading ? "Calculando..." : "Generar Tabla de Amortización"}
        </button>
      </form>

      {/* RESULTADOS */}
      {result && (
        <div className="result-card space-y-6">
          <h3 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
            <Building2 size={20} />
            Resultado - Método {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
          </h3>

          {/* RESUMEN */}
          {result.resumen && (
            <div className="grid sm:grid-cols-3 gap-4">
              <MetricCard label="Cuota Promedio" value={formatCurrency(result.resumen.cuotaPromedio || 0)} />
              <MetricCard label="Total Intereses" value={formatCurrency(result.resumen.totalIntereses || 0)} />
              <MetricCard label="Total a Pagar" value={formatCurrency(result.resumen.totalPagar || 0)} />
            </div>
          )}

          {/* TABLA */}
          {Array.isArray(result.tabla) && result.tabla.length > 0 && (
            <div className="overflow-x-auto bg-slate-800/40 border border-slate-700/40 rounded-lg shadow-lg">
              <table className="min-w-full text-sm text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Cuota</th>
                    <th className="px-4 py-3 text-left">Interés</th>
                    <th className="px-4 py-3 text-left">Amortización</th>
                    <th className="px-4 py-3 text-left">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tabla.map((fila, idx) => (
                    <tr
                      key={idx}
                      className={`border-t border-slate-700/50 ${
                        idx % 2 === 0 ? "bg-slate-800/40" : "bg-slate-900/30"
                      }`}
                    >
                      <td className="px-4 py-3">{fila.periodo || idx + 1}</td>
                      <td className="px-4 py-3">{formatCurrency(fila.cuota)}</td>
                      <td className="px-4 py-3 text-blue-400">{formatCurrency(fila.interes)}</td>
                      <td className="px-4 py-3 text-emerald-400">{formatCurrency(fila.amortizacion)}</td>
                      <td className="px-4 py-3">{formatCurrency(fila.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-card bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}

/* -------------------------------
 * COMPONENTES AUXILIARES
 * ------------------------------- */
function FormInput({ icon, label, value, onChange, placeholder, suffix }) {
  return (
    <div>
      <label className="label flex items-center gap-2 mb-1">
        {icon}
        {label}
      </label>
      <input
        className="input w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
        value={value}
        onChange={onChange}
        type="number"
        step="any"
        placeholder={placeholder}
      />
      {suffix}
    </div>
  )
}

function FormSelect({ icon, label, value, onChange, options, description }) {
  return (
    <div>
      <label className="label flex items-center gap-2 mb-1">
        {icon}
        {label}
      </label>
      <select
        className="select w-full bg-slate-900/60 border border-slate-700/50 rounded-lg p-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.text}
          </option>
        ))}
      </select>
      {description && <div className="text-sm text-orange-400 mt-1">{description}</div>}
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center shadow-md shadow-slate-900/20">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className="text-lg font-semibold text-slate-100">{value}</div>
    </div>
  )
}
