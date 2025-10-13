import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { PrivateRoute } from "./components/PrivateRoute"; // importa tu PrivateRoute
import { Profile } from "./pages/Profile";
import { SetupProfile } from "./pages/setupProfile";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/setupProfile" element={<SetupProfile />} />

          {/* Ruta protegida */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }

          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/setupProfile"
            element={
              <PrivateRoute>
                <SetupProfile />
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
