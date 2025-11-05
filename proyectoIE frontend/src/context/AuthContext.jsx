"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api, { path } from "../lib/api.js"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem("ie:auth")
      if (authData) {
        const { token, id } = JSON.parse(authData)
        if (token && id) {
          setUser({ id, token })
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (identification, password) => {
    try {
      const body = {
        identification: Number(identification), // asegúrate que sea numérico si idUser es Long
        password
      }
      const { data } = await api.post(path("/token/login"), body)
      const authData = { token: data.token, id: data.id }
      localStorage.setItem("ie:auth", JSON.stringify(authData))
      setUser(authData)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      }
    }
  }

  const register = async (userData) => {
    try {
      const payload = {
        idUser: Number(userData.identification),
        name: userData.name,
        lastname: userData.lastname,
        cellPhone: userData.cellPhone,
        password: userData.password
      }
      await api.post(path("/token/register"), payload)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrar usuario",
      }
    }
  }


  const logout = () => {
    localStorage.removeItem("ie:auth")
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
