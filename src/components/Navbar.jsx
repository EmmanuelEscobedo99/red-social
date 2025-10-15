import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaCog,
  FaPlusCircle,
} from "react-icons/fa";
import { Dropdown, Badge, InputGroup, Form, Button, Navbar, Container, Nav } from "react-bootstrap";
import { useState } from "react";
import logo from "../assets/public/Logo Logotipo Centro Creativo para Niños Infantil Colorido Rosa.png";
import "./Navbar.css";

function AppNavbar() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, texto: "Tienes un nuevo mensaje de Ana" },
    { id: 2, texto: "Carlos comentó tu publicación" },
    { id: 3, texto: "Nuevo seguidor: Laura" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      fixed="top"
      className="shadow-sm py-2 navbar-surface"
    >
      <Container fluid className="px-4">
        {/* LOGO */}
        <Navbar.Brand className="fw-bold text-primary">
            SURFACE<span className="text-dark">+</span>
          </Navbar.Brand>

        {/* BUSCADOR */}
        <div className="d-none d-md-flex mx-auto w-50">
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar publicaciones o usuarios..."
              className="border-start-0 shadow-none"
            />
          </InputGroup>
        </div>

        {/* ICONOS DERECHA */}
        <Nav className="ms-auto d-flex align-items-center gap-3">
          <Link to="/home" className="nav-icon" title="Inicio">
            <FaHome size={20} />
          </Link>

          <Link to="/crear" className="nav-icon" title="Crear publicación">
            <FaPlusCircle size={20} />
          </Link>

          <Link to="/profile" className="nav-icon" title="Perfil">
            <FaUserCircle size={21} />
          </Link>

          {/* NOTIFICACIONES */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-notifications"
              className="nav-icon position-relative"
            >
              <FaBell size={19} />
              {notificaciones.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {notificaciones.length}
                </Badge>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: "300px" }}>
              {notificaciones.length === 0 && (
                <Dropdown.ItemText>No hay notificaciones</Dropdown.ItemText>
              )}
              {notificaciones.map((noti) => (
                <Dropdown.Item key={noti.id}>{noti.texto}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* CONFIGURACIÓN */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="dropdown-settings"
              className="nav-icon"
            >
              <FaCog size={18} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/settings">
                Configuración
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/help">
                Ayuda
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
