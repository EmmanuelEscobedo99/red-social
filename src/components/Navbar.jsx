import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaCog,
  FaPlusCircle,
  FaUserSecret,
  FaMoon,
} from "react-icons/fa";
import {
  Dropdown,
  Badge,
  InputGroup,
  Form,
  Navbar,
  Container,
  Nav,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Navbar.css";

function AppNavbar() {
  const navigate = useNavigate();

  const [notificaciones, setNotificaciones] = useState([
    { id: 1, texto: "Tienes un nuevo mensaje de Ana" },
    { id: 2, texto: "Carlos comentó tu publicación" },
    { id: 3, texto: "Nuevo seguidor: Laura" },
  ]);

  // 🔒 Estado del modo sombra
  const [modoSombra, setModoSombra] = useState(
    localStorage.getItem("modoSombra") === "true"
  );

  // 🔁 Mantener sincronizado el modo sombra en localStorage
  useEffect(() => {
    localStorage.setItem("modoSombra", modoSombra ? "true" : "false");
    window.dispatchEvent(new Event("modoSombraChanged"));
  }, [modoSombra]);

  // 🌑 Aplicar clase global al body para modo sombra
  useEffect(() => {
    if (modoSombra) {
      document.body.classList.add("modo-sombra-activo");
    } else {
      document.body.classList.remove("modo-sombra-activo");
    }
  }, [modoSombra]);

  // 🔄 Cambiar modo sombra
  const toggleModoSombra = () => {
    setModoSombra((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("modoSombra");
    navigate("/");
  };

  // 🔗 Links del Reino Sombra
  const sombraLinks = [
    { path: "/sombra/foros", label: "Foros" },
    { path: "/sombra/chat", label: "Charlas 10 min" },
    { path: "/sombra/encuentro", label: "Encuentros" },
    { path: "/sombra/diario", label: "Diario" },
    { path: "/sombra/analisis", label: "Análisis IA" },
    { path: "/sombra/perfil", label: "Perfil" },
  ];

  return (
    <Navbar
      bg="light"
      expand="lg"
      fixed="top"
      className={`shadow-sm py-2 navbar-surface ${
        modoSombra ? "navbar-sombra" : ""
      }`}
    >
      <Container fluid className="px-4">
        {/* LOGO */}
        <Navbar.Brand
          className="fw-bold text-primary d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
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

          {/* 🔔 NOTIFICACIONES */}
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

          {/* ⚙️ CONFIGURACIÓN */}
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

          {/* 🌑 MODO SOMBRA */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="modo-sombra-toggle"
              className="d-flex align-items-center nav-icon"
              title="Modo Sombra (Publicar o comentar de forma anónima)"
            >
              <FaUserSecret
                size={20}
                className={modoSombra ? "text-dark" : "text-secondary"}
                style={{ marginRight: "6px" }}
              />
              <Form.Check
                type="switch"
                id="modo-sombra-switch"
                checked={modoSombra}
                onChange={toggleModoSombra}
              />
            </Dropdown.Toggle>

            {/* Si el modo sombra está activo, se despliega el menú del Reino */}
            {modoSombra && (
              <Dropdown.Menu className="shadow-lg bg-dark text-light border-0 mt-2">
                <Dropdown.Header className="text-center text-info">
                  <FaMoon className="me-2" />
                  Reino de las Sombras
                </Dropdown.Header>
                {sombraLinks.map((item) => (
                  <Dropdown.Item
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className="text-light"
                    style={{
                      background: "transparent",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#111")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
