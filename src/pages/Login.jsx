import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Card, Container, Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/public/Logotipo marketing digital y social media marca personal creativo azul y coral (1).png";
import axios from "axios";
import Swal from "sweetalert2";

const API = "http://localhost:4000/api/usuarios";

const loginSchema = Yup.object().shape({
  correo: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

const registerSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),
  correo: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      if (isRegister) {
        // Registro
        const res = await axios.post(`${API}/createUser`, values);
        if (res.data.ok) {
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "Ahora puedes iniciar sesión.",
          });
          setIsRegister(false); // vuelve al login
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.data.error || "No se pudo crear el usuario",
          });
        }
      } else {
        // Login
        const res = await axios.post(`${API}/login`, values);
        if (res.data.ok) {
          // Guardar token y user en localStorage
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          Swal.fire({
            icon: "success",
            title: "¡Bienvenido!",
            text: `Hola ${res.data.user.nombre}`,
            timer: 1500,
            showConfirmButton: false,
          });

          navigate("/home");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.data.error || "Credenciales inválidas",
          });
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Ocurrió un error, intenta de nuevo",
      });
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={10} sm={10} md={8} lg={6}>
          <div className="d-flex align-items-center justify-content-center">

            {/* Logo */}
            <div className="me-5 d-none d-md-flex justify-content-center">
              <img
                src={logo}
                alt="Logo de la app"
                style={{ width: "300px", height: "300px", objectFit: "contain" }}
              />
            </div>

            {/* Formulario */}
            <Col xs={12} md={6}>
              <Card className="shadow-lg p-4 rounded-4 border-0">
                <h3 className="text-center mb-4 fw-bold">
                  {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
                </h3>

                <Formik
                  initialValues={{ nombre: "", correo: "", password: "" }}
                  validationSchema={isRegister ? registerSchema : loginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      {isRegister && (
                        <BootstrapForm.Group className="mb-3">
                          <BootstrapForm.Label>Nombre</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="nombre"
                            as={BootstrapForm.Control}
                            placeholder="Tu nombre"
                          />
                          <ErrorMessage
                            name="nombre"
                            component="div"
                            className="text-danger small"
                          />
                        </BootstrapForm.Group>
                      )}

                      <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Correo Electrónico</BootstrapForm.Label>
                        <Field
                          type="correo"
                          name="correo"
                          as={BootstrapForm.Control}
                          placeholder="correo@ejemplo.com"
                        />
                        <ErrorMessage
                          name="correo"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>

                      <BootstrapForm.Group className="mb-3">
                        <BootstrapForm.Label>Contraseña</BootstrapForm.Label>
                        <Field
                          type="password"
                          name="password"
                          as={BootstrapForm.Control}
                          placeholder="********"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger small"
                        />
                      </BootstrapForm.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 rounded-pill"
                      >
                        {isRegister ? "Registrarme" : "Iniciar Sesión"}
                      </Button>
                    </Form>
                  )}
                </Formik>

                <div className="text-center mt-3">
                  <p className="small">
                    {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                    <Button
                      variant="link"
                      className="p-0 fw-semibold text-decoration-none"
                      onClick={() => setIsRegister(!isRegister)}
                    >
                      {isRegister ? "Inicia sesión" : "Crea una cuenta"}
                    </Button>
                  </p>
                </div>
              </Card>
            </Col>

          </div>
        </Col>
      </Row>
    </Container>
  );
};
