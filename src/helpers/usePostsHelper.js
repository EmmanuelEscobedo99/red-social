// helpers/postsHelper.js

/**
 * Dar o quitar "me gusta" a una publicación.
 */
export const toggleLike = (posts, postId) => {
  return posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        }
      : post
  );
};

/**
 * Agregar un comentario a una publicación.
 */
export const addComment = (posts, postId, text, user, modoSombra) => {
  if (!text.trim()) return posts;

  const nombreUsuario = modoSombra ? "Usuario en sombra" : user?.nombre || "Tú";

  return posts.map((p) =>
    p.id === postId
      ? {
          ...p,
          comments: [...p.comments, { user: nombreUsuario, text: text.trim() }],
        }
      : p
  );
};

/**
 * Compartir publicación (solo incrementa el contador).
 */
export const sharePost = (posts, postId) => {
  return posts.map((p) =>
    p.id === postId ? { ...p, shares: p.shares + 1 } : p
  );
};
