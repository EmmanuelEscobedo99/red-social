import React, { useEffect, useState } from 'react';
import { Button, Col, Image } from 'react-bootstrap';
import logo from '../assets/public/profile.jpg'; // Imagen por defecto
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);

  const token = localStorage.getItem('token');
  const usuarioLocal = JSON.parse(localStorage.getItem('user'));

  // Obtener datos del usuario
  const handleGetProfile = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/usuarios/getUser',
        { correo: usuarioLocal?.correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        setUser(response.data.user);
        // Luego traemos la configuración
        handleGetConfiguracion(response.data.user.id);
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  };

  // Obtener configuración de usuario
  const handleGetConfiguracion = async (usuarioId) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/configuracion/getConfiguracionUsuario',
        { usuarioId },
        { headers: { Authorization: `Bearer ${token}` } } // <-- quitar responseType
      );

      if (response.data.ok) {
        setConfig(response.data.configuracion);

        // Convertir Base64 a URL para mostrar la imagen
        if (response.data.configuracion.fotoPerfil) {
          const base64 = response.data.configuracion.fotoPerfil;
          const url = `data:image/jpeg;base64,${base64}`;
          setFotoPerfilURL(url);
        }
      }
    } catch (error) {
      console.error('Error al obtener la configuración:', error);
    }
  };

  const handleNavigate = () => {
    navigate('/setupProfile');
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{user?.nombre || 'Nombre Completo'}</h2>
      <div className="profile-container">
        <Col xs={6} md={4}>
          <Image
            src={fotoPerfilURL || logo}
            roundedCircle
            width={171}
            height={180}
          />
        </Col>
        <p>Usuario: {config?.nombreUsuario || user?.nombre}</p>
        <p>Correo: {user?.correo}</p>
        <Button onClick={handleNavigate}>Configurar</Button>
      </div>
    </div>
  );
};
