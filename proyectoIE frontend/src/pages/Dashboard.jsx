import {
  Calculator,
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  BarChart3,
  PiggyBank,
  PieChart,
  LineChart,
  Building,
  Wallet,
  Coins,
} from "lucide-react"

export default function Dashboard() {
  const features = [
    {
      icon: Calculator,
      title: "Cálculos Precisos",
      description: "Algoritmos avanzados para cálculos financieros exactos",
      color: "text-emerald-400",
    },
    {
      icon: TrendingUp,
      title: "Análisis Completo",
      description: "Evaluación integral de inversiones y proyectos",
      color: "text-blue-400",
    },
    {
      icon: Shield,
      title: "Datos Seguros",
      description: "Protección total de tu información financiera",
      color: "text-purple-400",
    },
    {
      icon: Zap,
      title: "Resultados Instantáneos",
      description: "Cálculos en tiempo real para decisiones rápidas",
      color: "text-yellow-400",
    },
  ]

  const quickActions = [
    { icon: Calculator, label: "Interés Simple", path: "/interes-simple", color: "bg-emerald-600" },
    { icon: TrendingUp, label: "Interés Compuesto", path: "/interes-compuesto", color: "bg-blue-600" },
    { icon: PiggyBank, label: "Anualidades", path: "/anualidades", color: "bg-purple-600" },
    { icon: DollarSign, label: "Tasa de Interés", path: "/tasa-real", color: "bg-orange-600" },
    { icon: BarChart3, label: "Capitalización", path: "/capitalizacion", color: "bg-teal-600" },
    { icon: Coins, label: "Gradiente Aritmético", path: "/gradiente-aritmetico", color: "bg-indigo-600" },
    { icon: Wallet, label: "Gradiente Geométrico", path: "/gradiente-geometrico", color: "bg-pink-600" },
    { icon: Building, label: "Tasa Interna de Retorno (TIR)", path: "/tir", color: "bg-rose-600" },
    { icon: PieChart, label: "Amortización", path: "/amortizacion", color: "bg-indigo-600" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          Ingeniería Económica
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Herramientas profesionales para análisis financiero y evaluación de proyectos de inversión
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <a
              key={index}
              href={action.path}
              className="group p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div
                className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">{action.label}</h3>
            </a>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="card group hover:border-emerald-500/30 transition-all duration-300">
              <Icon
                size={32}
                className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
