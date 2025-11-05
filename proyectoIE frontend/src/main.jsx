import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.jsx"
import { RecordsProvider } from "./context/RecordsContext.jsx"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RecordsProvider>
          <App />
        </RecordsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
