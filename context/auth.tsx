import React, { createContext, useState } from 'react'

type AuthContextType = {
  user: any
  isAuthenticated: boolean
  login: (userData: any) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {}
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
    // Optionally store in secure storage here
  }

  const logout = async () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
