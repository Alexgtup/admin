import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken')
  const location = useLocation()

  if (isAuthenticated) {
    return <Element {...rest} />
  } else {
    // Сохраняем текущий путь в state, чтобы вернуться после логина
    return <Navigate to="/login" state={{ from: location }} />
  }
}

export default ProtectedRoute
