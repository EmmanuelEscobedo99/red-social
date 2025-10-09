import { Link } from "react-router-dom";
import { FaHome, FaUserCircle, FaBell, FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo o nombre de la app */}
      <div className="navbar-left">
        <h2 className="logo">UniOn</h2>
      </div>

      {/* Barra de búsqueda */}
      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar publicaciones o usuarios..."
          />
        </div>
      </div>

      {/* Enlaces o íconos de navegación */}
      <div className="navbar-right">
        <Link to="/" className="nav-icon" title="Inicio">
          <FaHome />
        </Link>
        <Link to="/profile" className="nav-icon" title="Perfil">
          <FaUserCircle />
        </Link>
        <Link to="/notifications" className="nav-icon" title="Notificaciones">
          <FaBell />
        </Link>
        <Link to="/login" className="btn-login">
          Cerrar Sesión
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
