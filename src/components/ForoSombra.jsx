import React, { useState } from "react";
import { Card, Button, Form, ListGroup, Fade, Container, Row, Col } from "react-bootstrap";

export const ForoSombra = () => {
  const [foros] = useState([
    { id: 1, titulo: "Sombras del Pasado", desc: "Habla de cosas que quisieras olvidar..." },
    { id: 2, titulo: "Ecos Nocturnos", desc: "Confiesa lo que solo dices de noche." },
    { id: 3, titulo: "Sueños Rotos", desc: "Historias que no tuvieron final feliz." },
    { id: 4, titulo: "El Refugio del Silencio", desc: "Escribe sin miedo, nadie te juzgará." },
  ]);

  const [foroActivo, setForoActivo] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [texto, setTexto] = useState("");

  const entrarForo = (id) => setForoActivo(id);

  const handlePublicar = () => {
    if (!texto.trim()) return;
    const nuevos = {
      ...comentarios,
      [foroActivo]: [
        ...(comentarios[foroActivo] || []),
        { id: Date.now(), texto, autor: "👤 Usuario en Sombra" },
      ],
    };
    setComentarios(nuevos);
    setTexto("");
  };

  const salirForo = () => setForoActivo(null);

  const foroSeleccionado = foros.find((f) => f.id === foroActivo);

  return (
    <Container
      fluid="md"
      className="text-light p-4"
      style={{
        background:
          "radial-gradient(circle at center, rgba(10,10,20,0.9) 0%, rgba(0,0,0,0.95) 100%)",
        minHeight: "100vh",
        backdropFilter: "blur(6px)",
      }}
    >
      <Fade in={!foroActivo} mountOnEnter unmountOnExit>
        <div>
          <h2 className="text-center mb-4 text-primary fw-bold">🕶️ Foros de Sombra</h2>
          <p className="text-center text-muted mb-5">
            Elige un rincón oscuro y comparte tus pensamientos con otras sombras...
          </p>

          <Row xs={1} md={2} className="g-4">
            {foros.map((foro) => (
              <Col key={foro.id}>
                <Card
                  bg="dark"
                  text="light"
                  border="secondary"
                  className="shadow-lg border-opacity-25 hover-shadow transition-all"
                  style={{ cursor: "pointer" }}
                  onClick={() => entrarForo(foro.id)}
                >
                  <Card.Body>
                    <Card.Title className="text-info">{foro.titulo}</Card.Title>
                    <Card.Text className="text-muted small">{foro.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Fade>

      <Fade in={!!foroActivo} mountOnEnter unmountOnExit>
        <div>
          {foroActivo && (
            <>
              <Button
                variant="outline-light"
                size="sm"
                className="mb-3"
                onClick={salirForo}
              >
                ← Volver a foros
              </Button>

              <h3 className="text-info fw-bold mb-3">{foroSeleccionado?.titulo}</h3>

              <Card bg="dark" text="light" className="mb-3 border-secondary">
                <Card.Body>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="bg-black text-light border-secondary mb-2"
                    placeholder="Escribe desde la oscuridad..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  <Button variant="primary" onClick={handlePublicar}>
                    Publicar
                  </Button>
                </Card.Body>
              </Card>

              <ListGroup variant="flush">
                {(comentarios[foroActivo] || []).length === 0 ? (
                  <p className="text-muted fst-italic">Aún no hay pensamientos aquí...</p>
                ) : (
                  comentarios[foroActivo].map((c) => (
                    <ListGroup.Item
                      key={c.id}
                      className="bg-dark text-light border-secondary rounded mb-2"
                    >
                      <p className="mb-1">{c.texto}</p>
                      <small className="text-muted">{c.autor}</small>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </>
          )}
        </div>
      </Fade>
    </Container>
  );
};
