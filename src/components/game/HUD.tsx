"use client";
import { useGameStore } from "@/src/store/gameStore";
import { useState } from "react";

export default function HUD() {
  const { glassBalls, mission, isQuizOpen, closeQuiz, addGlassBall, setMission } = useGameStore();
  const [answer, setAnswer] = useState("");

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica básica de validação do minigame (Pode ser evoluída com IA depois)
    if (answer.toLowerCase().trim() === "hello world") {
      addGlassBall();
      setMission("Excelente! Agora encontre o próximo desafio escondido no grid.");
      closeQuiz();
      setAnswer("");
    } else {
      alert("VeJiTAI diz: Errado! Tente 'hello world' para passar.");
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6">
      
      {/* Topo */}
      <div className="flex justify-between items-start">
        <div className="glass-panel px-4 py-2 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl pointer-events-auto">
          <img src="/assets/logo-dkau-ai.png" alt="dKau.AI" className="h-8 md:h-10 drop-shadow-md" />
        </div>
        
        {/* Contador Dinâmico de Glass Balls */}
        <div className="glass-panel px-6 py-3 border border-[#ffa726]/30 bg-black/60 backdrop-blur-md rounded-xl pointer-events-auto flex items-center gap-3">
          <span className="text-gray-300 font-bold uppercase tracking-widest text-xs md:text-sm">Glass Balls</span>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffa726] to-[#ff55aa]">
            {glassBalls} <span className="text-gray-500 text-lg">/ 8</span>
          </div>
        </div>
      </div>

      {/* Missão Atual */}
      <div className="flex justify-center">
        <div className="glass-panel px-8 py-3 border border-white/10 bg-black/80 backdrop-blur-md rounded-full pointer-events-auto">
          <span className="text-[#6699ff] text-sm tracking-wide font-bold drop-shadow-md">
            {mission}
          </span>
        </div>
      </div>

      {/* Modal do Minigame (Abre quando colide com o bloco de conhecimento) */}
      {isQuizOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#0a0a0a] border border-[#ffa726]/50 p-8 rounded-2xl max-w-md w-full shadow-[0_0_50px_rgba(255,167,38,0.2)] text-center">
            <h2 className="text-2xl font-black text-white mb-4">Desafio de Tecnologia</h2>
            <p className="text-gray-300 mb-6">Qual é a primeira frase que todo programador aprende a escrever na tela?</p>
            
            <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Digite a resposta em inglês..." 
                className="px-4 py-3 rounded bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ffa726]"
                autoFocus
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-[#ffa726] to-[#e50914] text-white font-bold py-3 rounded hover:scale-105 transition-transform"
              >
                Desbloquear Glass Ball
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}