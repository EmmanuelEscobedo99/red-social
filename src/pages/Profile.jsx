import React, { useEffect, useState } from "react";
import { Button, Col, Image, Card, Spinner } from "react-bootstrap";
import logo from "../assets/public/profile.jpg"; // Imagen por defecto
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../components/Profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const usuarioLocal = JSON.parse(localStorage.getItem("user"));

  // Obtener datos del usuario
  const handleGetProfile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/usuarios/getUser",
        { correo: usuarioLocal?.correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setUser(response.data.user);
        handleGetConfiguracion(response.data.user.id);
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      setLoading(false);
    }
  };

  // Obtener configuración del usuario
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
          const base64 = response.data.configuracion.fotoPerfil;
          const url = `data:image/jpeg;base64,${base64}`;
          setFotoPerfilURL(url);
        }
      }
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/setupProfile");
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-loading">
        <Spinner animation="border" variant="primary" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Card className="profile-card shadow-lg border-0">
        <div className="profile-header"></div>

        <Card.Body className="text-center">
          <Col xs={12} className="d-flex flex-column align-items-center">
            <div className="profile-image-wrapper">
              <Image
                src={fotoPerfilURL || logo}
                roundedCircle
                width={160}
                height={160}
                className="profile-image"
              />
            </div>

            <h3 className="mt-3 mb-1 fw-bold text-dark">
              {user?.nombre || "Nombre Completo"}
            </h3>
            <p className="text-muted mb-2">@{config?.nombreUsuario || "usuario"}</p>
            <p className="text-secondary">{user?.correo}</p>

            <Button
              variant="primary"
              className="mt-3 rounded-pill px-4 py-2"
              onClick={handleNavigate}
            >
              Configurar Perfil
            </Button>
          </Col>
        </Card.Body>
      </Card>
    </div>
  );
};
