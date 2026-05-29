import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images uploadées via l'admin et servies depuis /public/uploads.
    // L'optimiseur next/image fait une requête HTTP interne vers le serveur
    // pour optimiser : derrière le reverse-proxy Plesk (HTTPS -> port Node),
    // cette requête échoue ("received null"). On sert donc les fichiers
    // statiques directement, sans optimisation.
    unoptimized: true,
  },
};

export default nextConfig;
