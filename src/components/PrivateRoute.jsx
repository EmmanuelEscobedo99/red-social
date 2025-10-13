import { Navigate } from "react-router-dom";

// Componente para proteger rutas
export function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // o verifica también localStorage.getItem("user")
  
  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza los hijos
  return children;
}
