import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pacotes nativos/WASM do banco ficam fora do bundle do servidor.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
};

export default nextConfig;
