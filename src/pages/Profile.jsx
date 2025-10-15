import React, { useEffect, useState } from "react";
import { Button, Col, Image, Card, Spinner, Container, Row } from "react-bootstrap";
import logo from "../assets/public/profile.jpg"; // Imagen por defecto
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");
  const usuarioLocal = JSON.parse(localStorage.getItem("user"));

  // --- Obtener datos del usuario ---
  const handleGetProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/usuarios/getUser",
        { correo: usuarioLocal?.correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setUser(response.data.user);
        await handleGetConfiguracion(response.data.user.id);
        await handleGetPublicaciones(response.data.user.id);
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetConfiguracion = async (usuarioId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/configuracion/getConfiguracionUsuario",
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setConfig(response.data.configuracion);
        if (response.data.configuracion.fotoPerfil) {
          const url = `data:image/jpeg;base64,${response.data.configuracion.fotoPerfil}`;
          setFotoPerfilURL(url);
        }
      }
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
    }
  };

  const handleGetPublicaciones = async (usuarioId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/publicacionesUsuario/getPublicacion",
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setPosts(response.data.publicaciones);
      }
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
    }
  };

  const handleNavigate = () => navigate("/setupProfile");

  useEffect(() => { handleGetProfile(); }, []);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-primary">Cargando perfil...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* --- Perfil --- */}
      <Card className="shadow-sm border-0 mb-4">
        <div style={{ background: "linear-gradient(135deg, #1877f2, #4a8ef1)", height: "100px" }}></div>
        <Card.Body className="text-center" style={{ marginTop: "-60px" }}>
          <Image
            src={fotoPerfilURL || logo}
            roundedCircle
            width={140}
            height={140}
            style={{ border: "5px solid #fff", boxShadow: "0 0 15px rgba(0,0,0,0.15)" }}
          />
          <h3 className="mt-3 mb-1 fw-bold">{user?.nombre || "Nombre Completo"}</h3>
          <p className="text-muted mb-1">@{config?.nombreUsuario || "usuario"}</p>
          <p className="text-secondary">{user?.correo}</p>
          <Button variant="primary" className="rounded-pill px-4 py-2 mt-2" onClick={handleNavigate}>
            Configurar Perfil
          </Button>
        </Card.Body>
      </Card>

      {/* --- Sección Bio --- */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-2">Acerca de</h5>
          <p>🏠 Vive en Ciudad de México</p>
          <p>🎓 Estudia Ingeniería en Sistemas</p>
          <p>💼 Trabaja en Desarrollo Web</p>
          <p>🎯 Intereses: Tecnología, Gaming, Música</p>
        </Card.Body>
      </Card>

      {/* --- Sección Amigos --- */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">Amigos</h5>
          <div className="d-flex flex-wrap gap-2">
            {[...Array(6)].map((_, idx) => (
              <Image
                key={idx}
                src={logo}
                roundedCircle
                width={60}
                height={60}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* --- Sección Fotos --- */}
      <Card className="shadow-sm mt-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">Fotos</h5>
          <div className="d-flex flex-wrap gap-2">
            {[...Array(8)].map((_, idx) => (
              <Image
                key={idx}
                src={logo}
                rounded
                style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
              />
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* --- Sección Publicaciones --- */}
      <h4 className="fw-bold mb-3">Tus Publicaciones</h4>
      {posts.length === 0 ? (
        <p className="text-center text-muted">No has publicado nada aún.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex mb-2 align-items-start">
                <Image
                  src={fotoPerfilURL || logo}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold">{user?.nombre || "Tú"}</h6>
                  <small className="text-muted">@{config?.nombreUsuario || "usuario"}</small>
                </div>
              </div>
              <p>{post.contenido}</p>
              {post.imagen && (
                <Image
                  src={post.imagen}
                  rounded
                  style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                />
              )}
              <div className="d-flex justify-content-between text-muted mt-2">
                <span>👍 Me gusta</span>
                <span>💬 Comentar</span>
                <span>🔄 Compartir</span>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

    </Container>
  );
};
