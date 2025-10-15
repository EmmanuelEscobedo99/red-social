import React, { useState } from "react";
import { Form, Button, Col, Image, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import { useUserProfile } from "../helpers/useUserProfile";

export const SetupProfile = () => {

  const { user } = useUserProfile();

  const [nombre, setNombre] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

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
      formData.append("usuarioId", user.id);
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "600", color: "#0d6efd" }}>
          Configura tu Perfil
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label style={{ fontWeight: "500" }}>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe tu nombre de usuario..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#ced4da",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFoto">
            <Form.Label style={{ fontWeight: "500" }}>Foto de Perfil</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                borderRadius: "10px",
                borderColor: "#ced4da",
              }}
            />
          </Form.Group>

          {preview && (
            <Col className="mb-3 d-flex justify-content-center">
              <Image
                src={preview}
                roundedCircle
                width={150}
                height={150}
                style={{
                  objectFit: "cover",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Col>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            style={{
              borderRadius: "12px",
              padding: "10px 0",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            Guardar Perfil
          </Button>
        </Form>
      </Card>
    </div>
  );
};
