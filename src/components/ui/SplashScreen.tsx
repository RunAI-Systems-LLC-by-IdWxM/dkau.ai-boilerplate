"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // A API de voz falhará silenciosamente no Chrome/Safari se não houver interação prévia do usuário.
    // O código está protegido num try/catch para evitar crash da tela de loading.
    const playKKISound = () => {
      try {
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance("K K I I I I I world");
          utterance.rate = 0.9;
          utterance.pitch = 0.8;
          utterance.volume = 1;
          
          const voices = window.speechSynthesis.getVoices();
          // Tenta buscar uma voz robótica/masculina
          const preferredVoice = voices.find(v => /male|daniel|fred|google uk english male/i.test(v.name));
          if (preferredVoice) utterance.voice = preferredVoice;

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        console.warn("Autoplay de áudio bloqueado pelo navegador até que o usuário interaja.", e);
      }
    };

    // Pequeno delay para garantir que a DOM carregou antes de tentar disparar áudio
    const audioTimer = setTimeout(playKKISound, 300);

    // Fade out e desmontagem do componente
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2200); // Tempo levemente aumentado para leitura do público alvo

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-black">
      <div className="relative flex flex-col items-center gap-6 px-4 text-center">
        
        {/* Logo Oficial com tamanho responsivo seguro */}
        <img 
          src="/assets/logo-dkau-ai.png" 
          alt="dKau.AI Logo" 
          className="h-32 md:h-48 object-contain animate-pulse drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]" 
        />
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-kki-neonBlue via-kki-neonPink to-kki-neonBlue animate-flash-pass drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
          KKI World
        </h1>
        
        {/* Texto focado em 6 a 10 anos */}
        <p className="text-gray-300 text-sm md:text-xl font-bold tracking-widest opacity-90">
          Onde a diversão encontra o futuro!
        </p>
      </div>
    </div>
  );
}