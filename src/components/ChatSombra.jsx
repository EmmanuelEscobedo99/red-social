import React, { useState, useEffect } from "react";

export const ChatSombra = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 min

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, from: "Tú" }]);
    setInput("");
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-indigo-300 mb-2">Charla entre Sombras</h2>
      <p className="text-sm text-gray-400 mb-4">
        Tiempo restante: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </p>
      <div className="bg-gray-900 border border-gray-800 h-64 overflow-y-auto p-3 rounded-lg text-left">
        {messages.map((m, i) => (
          <p key={i} className={m.from === "Tú" ? "text-indigo-300" : "text-gray-400"}>
            <strong>{m.from}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          className="flex-grow bg-gray-800 text-sm p-2 rounded-l border border-gray-700"
          placeholder="Di algo en la oscuridad..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-500 px-3 rounded-r hover:bg-indigo-400"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
