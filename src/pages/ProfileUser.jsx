import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Container, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import logo from "../assets/public/profile.jpg";

export const ProfileUser = () => {
  const { id } = useParams(); // 👈 toma el ID desde la URL
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // --- Obtener datos del usuario visitado ---
  const handleGetUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/usuarios/getUserById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.ok) {
        setUser(response.data.user);
        await handleGetConfiguracion(response.data.user.id);
        await handleGetPublicaciones(response.data.user.id);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Configuración del perfil ---
  const handleGetConfiguracion = async (usuarioId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/configuracion/getConfiguracionUsuario",
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok) {
        setConfig(res.data.configuracion);
        if (res.data.configuracion.fotoPerfil) {
          const url = `data:image/jpeg;base64,${res.data.configuracion.fotoPerfil}`;
          setFotoPerfilURL(url);
        }
      }
    } catch (error) {
      console.error("Error al obtener configuración:", error);
    }
  };

  // --- Publicaciones ---
  const handleGetPublicaciones = async (usuarioId) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/publicacionesUsuario/getPublicacion",
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.ok) {
        setPosts(res.data.publicaciones);
      }
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
    }
  };

  useEffect(() => {
    handleGetUserProfile();
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-primary">Cargando perfil...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h4>No se encontró el usuario 😢</h4>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* --- Encabezado del perfil --- */}
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
          <h3 className="mt-3 mb-1 fw-bold">{user?.nombre}</h3>
          <p className="text-muted mb-1">@{config?.nombreUsuario || "usuario"}</p>
          <p className="text-secondary">{user?.correo}</p>
          <Button variant="outline-primary" className="rounded-pill px-4 py-2 mt-2">
            Seguir
          </Button>
        </Card.Body>
      </Card>

      {/* --- Bio --- */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-2">Acerca de</h5>
          <p>🏠 Vive en Ciudad de México</p>
          <p>🎯 Intereses: Tecnología, Diseño, Innovación</p>
        </Card.Body>
      </Card>

      {/* --- Publicaciones --- */}
      <h4 className="fw-bold mb-3">Publicaciones</h4>
      {posts.length === 0 ? (
        <p className="text-center text-muted">Este usuario no ha publicado nada aún.</p>
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
                  <h6 className="mb-0 fw-bold">{user?.nombre}</h6>
                  <small className="text-muted">@{config?.nombreUsuario || "usuario"}</small>
                </div>
              </div>
              <p>{post.contenido}</p>
              {post.imagen && (
                <Image
                  src={`data:image/jpeg;base64,${post.imagen}`}
                  rounded
                  style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
                />
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};
