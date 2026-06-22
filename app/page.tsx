"use client";
import { useState } from "react";
import AuthModal from "@/src/components/ui/AuthModal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[url('/assets/background.png')] bg-cover bg-center">
        
        {/* Overlay limpo */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent z-0 pointer-events-none"></div>

        {/* Topbar: Botão "Entrar" removido, focando apenas na Logo */}
        <header className="relative w-full p-6 flex justify-between items-center z-20">
          <img 
            src="/assets/logo-dkau-ai.png" 
            alt="dKau.AI Logo" 
            className="h-16 md:h-24 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </header>

        {/* Área de Ação: Único Call to Action */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end px-4 mt-auto mb-16 md:mb-24">
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="group relative flex items-center justify-center px-16 py-5 font-black text-white text-3xl tracking-wide rounded-full overflow-hidden bg-gradient-to-r from-[#ffa726] to-[#e50914] shadow-[0_0_40px_rgba(229,9,20,0.6)] hover:shadow-[0_0_60px_rgba(229,9,20,0.9)] transition-all duration-300 hover:-translate-y-2 hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-3 drop-shadow-lg">
              JOGAR AGORA <span className="text-4xl leading-none">›</span>
            </span>
          </button>
        </div>
      </main>
    </>
  );
}