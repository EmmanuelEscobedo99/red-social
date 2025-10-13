import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { PrivateRoute } from "./components/PrivateRoute"; // importa tu PrivateRoute

function AppContent() {
  const location = useLocation();

  // Oculta el Navbar en rutas específicas
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/createAccount";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/createAccount" element={<CreateAccount />} />

          {/* Ruta protegida */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
