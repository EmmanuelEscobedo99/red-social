import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { PrivateRoute } from "./components/PrivateRoute"; // importa tu PrivateRoute
import { Profile } from "./pages/Profile";
import { SetupProfile } from "./pages/setupProfile";
import { ReinoSombra } from "./pages/ReinoSombra";
import { ForoSombra } from "./components/ForoSombra";
import { ChatSombra } from "./components/ChatSombra";
import { EncuentroAleatorio } from "./components/EncuentroAleatorio";
import { DiarioSombra } from "./components/DiarioSombra";
import { AnalisisSombra } from "./components/AnalisisSombra";
import { PerfilSombra } from "./components/PerfilSombra";
import "./components/ModoSombra.css";
import { ProfileUser } from "./pages/ProfileUser";


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
          <Route path="/reinoSombra" element={<ReinoSombra />} />
          <Route path="/sombra/foros" element={<ForoSombra />} />
          <Route path="/sombra/chat" element={<ChatSombra />} />
          <Route path="/sombra/encuentro" element={<EncuentroAleatorio />} />
          <Route path="/sombra/diario" element={<DiarioSombra />} />
          <Route path="/sombra/analisis" element={<AnalisisSombra />} />
          <Route path="/sombra/perfil" element={<PerfilSombra />} />
          <Route path="/profileUser/:id" element={<ProfileUser />} />

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
          <Route
            path="/reinoSombra"
            element={
              <PrivateRoute>
                <ReinoSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/foros"
            element={
              <PrivateRoute>
                <ForoSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/chat"
            element={
              <PrivateRoute>
                <ChatSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/encuentro"
            element={
              <PrivateRoute>
                <EncuentroAleatorio />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/diario"
            element={
              <PrivateRoute>
                <DiarioSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/analisis"
            element={
              <PrivateRoute>
                <AnalisisSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/sombra/perfil"
            element={
              <PrivateRoute>
                <PerfilSombra />
              </PrivateRoute>
            }
          />
          <Route
            path="/profileUser/:id"
            element={
              <PrivateRoute>
                <PerfilSombra />
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
