import React from "react";
import { Routes, Route } from "react-router-dom";
import { SombraNavbar } from "../components/SombraNavbar";
import { ForoSombra } from "../components/ForoSombra";
import { ChatSombra } from "../components/ChatSombra";
import { EncuentroAleatorio } from "../components/EncuentroAleatorio";
import { DiarioSombra } from "../components/DiarioSombra";
import { AnalisisSombra } from "../components/AnalisisSombra";
import { PerfilSombra } from "../components/PerfilSombra";

export const ReinoSombra = () => {
  return (
    <div
      className="min-h-screen text-gray-100"
      style={{
        background: "radial-gradient(circle at center, #0b0b0f 0%, #000000 100%)",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/dark-mosaic.png')",
      }}
    >
      {/* Neblina animada */}
      <div className="absolute inset-0 bg-[url('https://i.ibb.co/tPdc7sV/fog.gif')] opacity-20 pointer-events-none" />
      <SombraNavbar />

      <div className="pt-24 px-6">
        <Routes>
          <Route path="foros" element={<ForoSombra />} />
          <Route path="chat" element={<ChatSombra />} />
          <Route path="encuentro" element={<EncuentroAleatorio />} />
          <Route path="diario" element={<DiarioSombra />} />
          <Route path="analisis" element={<AnalisisSombra />} />
          <Route path="perfil" element={<PerfilSombra />} />
        </Routes>
      </div>
    </div>
  );
};
