import React from "react";
import { Link, useLocation } from "react-router-dom";

export const SombraNavbar = () => {
  const location = useLocation();
  const links = [
    { path: "/sombra/foros", label: "Foros" },
    { path: "/sombra/chat", label: "Charlas 10min" },
    { path: "/sombra/encuentro", label: "Encuentros" },
    { path: "/sombra/diario", label: "Diario" },
    { path: "/sombra/analisis", label: "Análisis IA" },
    { path: "/sombra/perfil", label: "Perfil" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="flex justify-center gap-8 py-3">
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className={`text-sm uppercase tracking-wide ${
              location.pathname === l.path ? "text-indigo-400" : "text-gray-400"
            } hover:text-indigo-300 transition`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
