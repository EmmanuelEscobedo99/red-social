import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import {
  FaUpload,
  FaGlobe,
  FaFilter,
  FaHeart,
  FaRegComment,
  FaShare,
} from "react-icons/fa";
import { toggleLike, addComment, sharePost } from "../helpers/usePostsHelper";
import { useUserProfile } from "../helpers/useUserProfile";

export const Home = () => {
  const { usuariosSugeridos } = useUserProfile();
  const [usuariosConAvatar, setUsuariosConAvatar] = useState([]);
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [fotoPerfilURL, setFotoPerfilURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const usuarioLocal = JSON.parse(localStorage.getItem("user"));
  const modoSombra = localStorage.getItem("modoSombra") === "true";
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Estado para controlar comentarios
  const [activeComments, setActiveComments] = useState({});

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "María López",
      username: "@marial",
      avatar: "https://i.pravatar.cc/48?img=12",
      text: "Lanzando mi proyecto con NFCW 🚀 #Innovación",
      image: null,
      likes: 24,
      comments: [
        { user: "Diego", text: "Wow! Suena increíble 🔥" },
        { user: "Ana", text: "¡Mucho éxito!" },
      ],
      shares: 2,
      liked: false,
    },
    {
      id: 2,
      user: "Diego Ruiz",
      username: "@diego.dev",
      avatar: "https://i.pravatar.cc/48?img=32",
      text: "Nuevo reto: crea una ilustración en 60 minutos 🎨 #SpeedArt",
      image: "https://picsum.photos/600/300",
      likes: 102,
      comments: [
        { user: "María", text: "Quiero unirme 😍" },
        { user: "Pablo", text: "Tremendo reto 👏" },
      ],
      shares: 8,
      liked: true,
    },
  ]);

  // --- Perfil ---
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
    } finally {
      setLoading(false);
    }
  };

  // --- Subir imagen ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Publicar ---
  const handlePost = async () => {
    if (postText.trim() === "" && !imageFile) return;

    try {
      const formData = new FormData();
      formData.append("contenido", postText);
      formData.append("usuarioId", user?.id);
      if (imageFile) formData.append("imagen", imageFile);

      const response = await axios.post(
        "http://localhost:4000/api/publicacionesUsuario/crearPublicacion",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.ok) {
        const nueva = response.data.publicacion;
        const image = nueva.imagen ? `data:image/jpeg;base64,${nueva.imagen}` : null;

        const newPost = {
          id: nueva.id,
          user: user?.nombre || "Tú",
          username: `@${config?.nombreUsuario || "usuario"}`,
          avatar:
            fotoPerfilURL ||
            "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
          text: nueva.contenido,
          image,
          likes: 0,
          comments: [],
          shares: 0,
          liked: false,
        };

        setPosts((prev) => [newPost, ...prev]);
        setPostText("");
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error al publicar:", error);
    }
  };

  // Me gusta
  const handleLike = (id) => {
    setPosts((prev) => toggleLike(prev, id));
  };

  // Mostrar/Ocultar comentarios
  const toggleComments = (id) => {
    setActiveComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Agregar comentario
  const handleAddComment = (postId, text) => {
    setPosts((prev) => addComment(prev, postId, text, user, modoSombra));
  };

  // Compartir
  const handleShare = (id) => {
    setPosts((prev) => sharePost(prev, id));
    alert("Post compartido 🚀");
  };

  // --- Fetch Avatares y nombreUsuario ---
  useEffect(() => {
    const fetchAvatares = async () => {
      const token = localStorage.getItem("token");

      const usuarios = await Promise.all(
        usuariosSugeridos.map(async (u) => {
          try {
            const response = await axios.post(
              "http://localhost:4000/api/configuracion/getConfiguracionUsuario",
              { usuarioId: u.id },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const avatar = response.data.ok && response.data.configuracion.fotoPerfil
              ? `data:image/jpeg;base64,${response.data.configuracion.fotoPerfil}`
              : "https://i.pravatar.cc/48";

            const nombreUsuario = response.data.ok && response.data.configuracion.nombreUsuario
              ? response.data.configuracion.nombreUsuario
              : u.nombre || "usuario";

            return { ...u, avatar, nombreUsuario };
          } catch (error) {
            console.error("Error al obtener configuración de usuario:", error);
            return { ...u, avatar: "https://i.pravatar.cc/48", nombreUsuario: u.nombre || "usuario" };
          }
        })
      );

      setUsuariosConAvatar(usuarios);
    };

    if (usuariosSugeridos.length > 0) fetchAvatares();
  }, [usuariosSugeridos]);

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <Container style={{ marginTop: "90px" }}>
      <Row>
        <Col md={8}>
          {/* Composer */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-start">
                <Image
                  src={
                    fotoPerfilURL ||
                    "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                  }
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-2 border"
                  style={{ objectFit: "cover" }}
                />
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="¿Qué estás pensando?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              </div>

              {imagePreview && (
                <div className="mt-2 text-center position-relative">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setImagePreview(null)}
                    className="position-absolute top-0 end-0 m-2"
                  >
                    ✖
                  </Button>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-flex gap-2">
                  <Form.Group controlId="formFile" className="mb-0">
                    <Form.Label
                      className="btn btn-outline-secondary btn-sm mb-0"
                      style={{ cursor: "pointer" }}
                    >
                      <FaUpload className="me-1" /> Imagen
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </Form.Label>
                  </Form.Group>

                  <Button variant="outline-secondary" size="sm">
                    <FaGlobe className="me-1" /> Público
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <FaFilter className="me-1" /> NFCW
                  </Button>
                </div>

                <Button variant="primary" size="sm" onClick={handlePost}>
                  Publicar
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* 📰 Feed */}
          {posts.map((post) => (
            <Card key={post.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex">
                  <Image
                    src={post.avatar}
                    roundedCircle
                    className="me-2"
                    style={{ width: "48px", height: "48px" }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{post.user}</h6>
                    <small className="text-muted">{post.username}</small>
                    <p className="mt-2">{post.text}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="img-fluid rounded mb-2"
                      />
                    )}

                    {/* 🔘 Botones */}
                    <div className="d-flex gap-4 text-muted small mt-2">
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none d-flex align-items-center gap-1"
                        onClick={() => handleLike(post.id)}
                      >
                        <FaHeart color={post.liked ? "red" : "gray"} size={16} />
                        <span>{post.likes}</span>
                      </Button>

                      <Button
                        variant="link"
                        className="p-0 text-decoration-none d-flex align-items-center gap-1"
                        onClick={() => toggleComments(post.id)}
                      >
                        <FaRegComment size={16} />
                        <span>{post.comments.length}</span>
                      </Button>

                      <Button
                        variant="link"
                        className="p-0 text-decoration-none d-flex align-items-center gap-1"
                        onClick={() => handleShare(post.id)}
                      >
                        <FaShare size={16} />
                        <span>{post.shares}</span>
                      </Button>
                    </div>

                    {/* 💬 Comentarios */}
                    {activeComments[post.id] && (
                      <div className="mt-3 border-top pt-2">
                        {post.comments.length === 0 && (
                          <p className="text-muted small">
                            No hay comentarios aún. Sé el primero.
                          </p>
                        )}

                        {post.comments.map((c, i) => (
                          <div key={i} className="d-flex mb-2">
                            <Image
                              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                              roundedCircle
                              width={32}
                              height={32}
                              className="me-2"
                            />
                            <div className="bg-light p-2 rounded flex-grow-1">
                              <strong>{c.user}</strong>
                              <p className="mb-0 small">{c.text}</p>
                            </div>
                          </div>
                        ))}

                        <Form
                          className="d-flex mt-2"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.target.elements[`comment-${post.id}`];
                            handleAddComment(post.id, input.value);
                            input.value = "";
                          }}
                        >
                          <Form.Control
                            name={`comment-${post.id}`}
                            placeholder="Escribe un comentario..."
                            size="sm"
                          />
                          <Button variant="primary" size="sm" className="ms-2">
                            Enviar
                          </Button>
                        </Form>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>

        {/* 📈 Sidebar derecha */}
        <Col md={4} className="d-none d-md-block">
          <Card className="mb-3 shadow-sm">
            <Card.Header className="fw-bold">Tendencias</Card.Header>
            <Card.Body>
              <p>#NFCW — Nueva forma de compartir 🔥</p>
              <p>#React — Creadores unidos ⚛️</p>
              <p>#Innovación — Lo próximo está aquí 🚀</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Personas sugeridas</Card.Header>
            <Card.Body>
              {usuariosConAvatar.slice(0, 3).map((u) => (
                <div key={u.id} className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <Image
                      src={u.avatar}
                      roundedCircle
                      width={40}
                      height={40}
                      className="me-2"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <div className="fw-bold">{u.nombre}</div>
                      <small className="text-muted">
                        @{u.nombreUsuario.toLowerCase().replace(/\s/g, "")}
                      </small>
                    </div>
                  </div>
                  <Button size="sm" variant="primary">
                    Seguir
                  </Button>
                </div>
              ))}

              {usuariosConAvatar.length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="link" size="sm">
                    Ver más
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
