import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desativa o botão flutuante 'N' (Build Activity) no canto inferior da tela
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;