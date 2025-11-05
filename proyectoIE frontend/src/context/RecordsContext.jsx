"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext.jsx"

const RecordsContext = createContext()

export const useRecords = () => {
  const context = useContext(RecordsContext)
  if (!context) {
    throw new Error("useRecords must be used within a RecordsProvider")
  }
  return context
}

export const RecordsProvider = ({ children }) => {
  const [records, setRecords] = useState([])
  const { user } = useAuth()

  // Load records from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedRecords = localStorage.getItem(`ie:records:${user.id}`)
      if (savedRecords) {
        try {
          setRecords(JSON.parse(savedRecords))
        } catch (error) {
          console.error("Error loading records:", error)
          setRecords([])
        }
      }
    }
  }, [user?.id])

  // Save records to localStorage whenever records change
  useEffect(() => {
    if (user?.id && records.length > 0) {
      localStorage.setItem(`ie:records:${user.id}`, JSON.stringify(records))
    }
  }, [records, user?.id])

  const addRecord = (calculation) => {
    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user?.id,
      ...calculation,
    }

    setRecords((prev) => [newRecord, ...prev].slice(0, 100)) // Keep only last 100 records
    return newRecord
  }

  const deleteRecord = (recordId) => {
    setRecords((prev) => prev.filter((record) => record.id !== recordId))
  }

  const clearAllRecords = () => {
    setRecords([])
    if (user?.id) {
      localStorage.removeItem(`ie:records:${user.id}`)
    }
  }

  const getRecordsByCategory = (category) => {
    return records.filter((record) => record.category === category)
  }

  const value = {
    records,
    addRecord,
    deleteRecord,
    clearAllRecords,
    getRecordsByCategory,
  }

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>
}
