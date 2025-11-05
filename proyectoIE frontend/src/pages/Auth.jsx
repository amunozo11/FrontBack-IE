"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn, UserPlus, Calculator, TrendingUp, Shield, Zap } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"

export default function Auth() {
  const [mode, setMode] = useState("login")
  const [identification, setIdentification] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [lastname, setLastname] = useState("")
  const [cellPhone, setCell] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(identification, password)

    if (result.success) {
      navigate("/")
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await register({
      name,
      lastname,
      password,
      cellPhone,
      identification,
    })

    if (result.success) {
      setMode("login")
      setError("")
      // Clear form
      setName("")
      setLastname("")
      setCell("")
      setIdentification("")
      setPassword("")
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                FinanceIE
              </h1>
            </div>
            <p className="text-xl text-slate-300">Plataforma profesional de Ingeniería Económica</p>
            <p className="text-slate-400">
              Herramientas avanzadas para análisis financiero, cálculos de interés, evaluación de proyectos y toma de
              decisiones económicas.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Análisis financiero avanzado</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Datos seguros y encriptados</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Cálculos en tiempo real</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex bg-slate-800/50 rounded-xl p-1 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  mode === "login" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  mode === "register" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Registro
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Identificación</label>
                  <input
                    type="text"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu identificación"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Celular</label>
                  <input
                    type="tel"
                    value={cellPhone}
                    onChange={(e) => setCell(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Número de celular"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Identificación</label>
                  <input
                    type="text"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Número de identificación"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Crea una contraseña segura"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
