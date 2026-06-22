"use client";
import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Estados do formulário
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de feedback visual
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        // Lógica de Login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Sucesso: Aqui você redirecionará para a rota /game (Mundo KKI)
        setSuccessMsg("Login efetuado! Preparando o Mundo KKI...");
        setTimeout(() => window.location.href = "/game", 1500);

      } else {
        // Lógica de Cadastro
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        setSuccessMsg("Conta criada com sucesso! Verifique seu e-mail.");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-panel relative w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 bg-[#0a0a0a]/80 border border-white/10 rounded-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
          aria-label="Fechar"
        >
          &times;
        </button>
        
        <h2 className="text-3xl font-bold mb-2 text-white text-center">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          {isLogin ? "Bem-vindo de volta ao Mundo KKI!" : "Junte-se à aventura com KauAI."}
        </p>

        {/* Feedbacks Visuais */}
        {errorMsg && <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center">{successMsg}</div>}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block" htmlFor="email">E-mail</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aventureiro@mundo.kki" 
              required
              className="w-full px-4 py-3 rounded-md bg-black/50 border border-white/10 text-white focus:outline-none focus:border-kki-accent transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block" htmlFor="password">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-md bg-black/50 border border-white/10 text-white focus:outline-none focus:border-kki-accent transition-colors"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-md transition-colors mt-2 text-white ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-kki-primary hover:bg-red-700"
            }`}
          >
            {loading ? "Processando..." : isLogin ? "Acessar Mundo KKI" : "Cadastrar e Jogar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={toggleMode}
            type="button"
            className="text-sm text-kki-accent hover:text-white transition-colors"
          >
            {isLogin ? "Não tem uma conta? Cadastre-se aqui." : "Já tem uma conta? Entre aqui."}
          </button>
        </div>

        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-sm text-gray-500">ou acesse com</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* Provedores (Mockados visualmente para integração futura via Supabase OAuth) */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="bg-[#111] hover:bg-[#222] border border-white/5 text-gray-300 py-2 rounded-md text-sm transition-colors">Microsoft</button>
          <button type="button" className="bg-[#111] hover:bg-[#222] border border-white/5 text-gray-300 py-2 rounded-md text-sm transition-colors">Apple</button>
          <button type="button" className="bg-[#111] hover:bg-[#222] border border-white/5 text-gray-300 py-2 rounded-md text-sm transition-colors">Google</button>
          <button type="button" className="bg-[#111] hover:bg-[#222] border border-white/5 text-gray-300 py-2 rounded-md text-sm transition-colors">OpenAI</button>
        </div>
      </div>
    </div>
  );
}