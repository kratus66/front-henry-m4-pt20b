// @type {import('next').NextConfig}
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.apple.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '0f7b-190-143-75-12.ngrok-free.app',
        port: '', // Puedes dejarlo vacío si no tienes un puerto específico
        pathname: '/images/**', // Ajusta el pathname si es necesario
      },
      {
        protocol: 'https',
        hostname: 'w7.pngwing.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/images/**',
      },

    ],
  },
  // Configuración de variables de entorno
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',  // Define una URL predeterminada si no está configurada
  },
};

export default nextConfig;





