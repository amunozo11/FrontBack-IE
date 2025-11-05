import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

import Dashboard from "./pages/Dashboard.jsx"
import InteresSimple from "./pages/InteresSimple.jsx"
import InteresCompuesto from "./pages/InteresCompuesto.jsx"
import Anualidades from "./pages/Anualidades.jsx"
import Amortizacion from "./pages/Amortizacion.jsx"
import GradienteA from "./pages/GradienteAritmetico.jsx"
import GradienteG from "./pages/GradienteGeometrico.jsx"
import TIR from "./pages/TIR.jsx"
import TIRM from "./pages/TIRM.jsx"
import ROI from "./pages/ROI.jsx"
import TasaReal from "./pages/TasaReal.jsx"
import Inflacion from "./pages/Inflacion.jsx"
import UVR from "./pages/UVR.jsx"
import Auth from "./pages/Auth.jsx"
import Registros from "./pages/Registros.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/interes-simple" element={<InteresSimple />} />
                <Route path="/interes-compuesto" element={<InteresCompuesto />} />
                <Route path="/anualidades" element={<Anualidades />} />
                <Route path="/amortizacion" element={<Amortizacion />} />
                <Route path="/gradiente-aritmetico" element={<GradienteA />} />
                <Route path="/gradiente-geometrico" element={<GradienteG />} />
                <Route path="/tir" element={<TIR />} />
                <Route path="/tirm" element={<TIRM />} />
                <Route path="/roi" element={<ROI />} />
                <Route path="/tasa-real" element={<TasaReal />} />
                <Route path="/inflacion" element={<Inflacion />} />
                <Route path="/uvr" element={<UVR />} />
                <Route path="/registros" element={<Registros />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
