/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */

import Layout from "@/modules/core/Layout";
import AuthForm from "@/modules/oraculoTecnologico/AuthForm";
import BackgroundEffects from "@/modules/interfazSensorial/BackgroundEffects";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

/**
 * PÃ¡gina de inicio de sesiÃ³n
 * 
 * Implementa el OrÃ¡culo TecnolÃ³gico para la autenticaciÃ³n de usuarios
 */
const Login = () => {
  return (
    <Layout>
      {/* Efectos visuales de fondo */}
      <BackgroundEffects />
      
      <motion.main 
        className="flex-1 container max-w-md mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        
        <AuthForm 
          type="login"
          title="Iniciar SesiÃ³n"
          buttonText="Iniciar SesiÃ³n"
          footerText="Â¿No tienes una cuenta?"
          footerLinkText="RegÃ­strate"
          footerLinkUrl="/register"
        />
      </motion.main>
    </Layout>
  );
};

export default Login;
