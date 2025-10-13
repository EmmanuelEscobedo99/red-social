import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle, FaBell, FaSearch, FaCog } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./Navbar.css";
import logo from "../assets/public/Logo Logotipo Centro Creativo para Niños Infantil Colorido Rosa.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina token y usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirige a login
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <h2 style={{ marginLeft: "10px" }}>UNIONS</h2>
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

      {/* Íconos y menú */}
      <div className="navbar-right" style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
        <Link to="/" className="nav-icon" title="Inicio">
          <FaHome />
        </Link>
        <Link to="/profile" className="nav-icon" title="Perfil">
          <FaUserCircle />
        </Link>
        <Link to="/notifications" className="nav-icon" title="Notificaciones">
          <FaBell />
        </Link>

        {/* Dropdown con tuerca */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" id="dropdown-basic" className="settings-toggle">
            <FaCog size={20} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/settings">Configuración</Dropdown.Item>
            <Dropdown.Item as={Link} to="/help">Ayuda</Dropdown.Item>
            <Dropdown.Divider />
            {/* Logout */}
            <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

export default Navbar;
