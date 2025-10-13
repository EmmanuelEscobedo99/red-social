import React, { useState } from "react";
import { Form, Button, Col, Image } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

export const SetupProfile = () => {
  const [nombre, setNombre] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cuando seleccionan imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre) {
      Swal.fire("Error", "El nombre es obligatorio", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("usuarioId", 1);
      formData.append("nombreUsuario", nombre);
      if (foto) formData.append("fotoPerfil", foto);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:4000/api/configuracion/createConfiguracionUsuario",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.ok) {
        Swal.fire("¡Éxito!", "Perfil configurado correctamente", "success");
      } else {
        Swal.fire("Error", response.data.error || "No se pudo guardar", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error al guardar el perfil", "error");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Configura tu perfil</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Escribe un usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Foto de Perfil</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
        </Form.Group>

        {preview && (
          <Col xs={6} md={4} className="mb-3">
            <Image src={preview} roundedCircle width={150} height={150} />
          </Col>
        )}

        <Button type="submit" variant="primary" className="w-100">
          Guardar Perfil
        </Button>
      </Form>
    </div>
  );
};
