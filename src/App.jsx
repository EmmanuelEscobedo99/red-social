import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      {/* Barra de navegación visible en todas las páginas */}
      <Navbar />

      {/* Contenedor de rutas */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
