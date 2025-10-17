import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Hook personalizado para obtener perfil y configuración del usuario autenticado.
 */
export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuariosSugeridos, setUsuariosSugeridos] = useState([]);

  const token = localStorage.getItem("token");
  const usuarioLocal = JSON.parse(localStorage.getItem("user"));

  // Obtener usuarios para sugerencias de amistad
  const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const usuarioLocal = JSON.parse(localStorage.getItem("user"));

        const response = await axios.post(
          "http://localhost:4000/api/usuarios/getAllUsers",
          { usuarioId: usuarioLocal?.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.ok) {
          setUsuariosSugeridos(response.data.usuarios);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

  // Obtener datos del usuario
  const handleGetProfile = async () => {
    if (!usuarioLocal?.correo || !token) {
      console.warn("No se encontró usuario o token en localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/usuarios/getUser",
        { correo: usuarioLocal.correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.ok) {
        const userData = response.data.user;
        setUser(userData);
        await handleGetConfiguracion(userData.id);
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
        const configData = response.data.configuracion;
        setConfig(configData);

        if (configData.fotoPerfil) {
          const base64 = configData.fotoPerfil;
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

  // Cargar automáticamente al montar
  useEffect(() => {
    handleGetProfile();
    fetchUsuarios();
  }, []);

  // Retornar datos y funciones útiles
  return { user, config, fotoPerfilURL, loading, reloadUser: handleGetProfile, usuariosSugeridos };
};
