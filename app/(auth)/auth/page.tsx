"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail, User, KeyRound, LogIn } from "lucide-react";
import { Cinzel, Fira_Code } from "next/font/google";
import { motion } from "framer-motion";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
});

const firaCode = Fira_Code({
  subsets: ["latin"],
});

const AuthPage = () => {
  const [authType, setAuthType] = useState<"login" | "register">("login");

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <video
          src="/elementalist-lux-login.mp4"
          autoPlay
          muted
          loop
          className="h-full w-full object-cover opacity-30 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,black_90%)]" />
      </div>

      {/* Auth Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-lg flex-col items-center"
      >
        <div className="relative w-full rounded-md border-t-2 border-lol-gold/50 bg-gradient-to-b from-[#0a1428]/80 to-[#010a13]/80 p-10 pt-12 shadow-2xl shadow-lol-blue/20 backdrop-blur-md hextech-glow">
          {/* Hextech Frame */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corners */}
            <div className="absolute -top-[2px] -left-[2px] h-10 w-10 border-l-2 border-t-2 border-lol-gold" />
            <div className="absolute -top-[2px] -right-[2px] h-10 w-10 border-r-2 border-t-2 border-lol-gold" />
            <div className="absolute -bottom-[2px] -left-[2px] h-10 w-10 border-l-2 border-b-2 border-lol-gold" />
            <div className="absolute -bottom-[2px] -right-[2px] h-10 w-10 border-r-2 border-b-2 border-lol-gold" />
            {/* Side Accents */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 h-24 w-1.5 bg-lol-gold/70" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 h-24 w-1.5 bg-lol-gold/70" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h1
              className={cn(
                "mb-4 text-center text-5xl font-bold uppercase tracking-widest text-lol-gold",
                cinzel.className
              )}
            >
              WardScore
            </h1>
            <h2
              className={cn(
                "mb-10 text-center font-bold uppercase tracking-wider text-lol-blue/80",
                firaCode.className
              )}
            >
              {authType === "login" ? "Acessar sua Conta" : "Criar Nova Conta"}
            </h2>

            {authType === "login" ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </div>
        <motion.div
          className="mt-8 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <FormSwitch authType={authType} setAuthType={setAuthType} />
        </motion.div>
      </motion.div>
    </main>
  );
};

const commonInputClass =
  "h-12 border-2 border-lol-blue/30 bg-[#010a13]/50 pl-12 text-white placeholder:text-neutral-500 focus:border-lol-gold focus:ring-lol-gold/50 transition-all duration-300 shadow-inner shadow-black/30";

const AuthInput = ({ icon: Icon, ...props }: any) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-lol-gold/60" />
    <Input className={commonInputClass} {...props} />
  </div>
);

const LoginForm = () => (
  <form className="space-y-6">
    <AuthInput icon={Mail} type="email" placeholder="Email" required />
    <AuthInput icon={KeyRound} type="password" placeholder="Senha" required />
    <div className="flex items-center justify-end">
      <Button
        variant="link"
        size="sm"
        className="px-0 text-xs text-neutral-400 hover:text-lol-gold/80"
      >
        Esqueceu sua senha?
      </Button>
    </div>
    <Button
      type="submit"
      className="group relative h-14 w-full overflow-hidden border-2 border-lol-blue/50 bg-lol-blue/80 text-lg font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-lol-blue hover:shadow-lg hover:shadow-lol-blue/30"
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      <LogIn className="mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
      <span>Entrar</span>
    </Button>
  </form>
);

const RegisterForm = () => (
  <form className="space-y-6">
    <AuthInput icon={User} type="text" placeholder="Nome de Usuário" required />
    <AuthInput icon={Mail} type="email" placeholder="Email" required />
    <AuthInput icon={KeyRound} type="password" placeholder="Senha" required />
    <AuthInput
      icon={KeyRound}
      type="password"
      placeholder="Confirmar Senha"
      required
    />
    <Button
      type="submit"
      className="group relative h-14 w-full overflow-hidden border-2 border-lol-gold/50 bg-lol-gold/80 text-lg font-bold uppercase tracking-wider text-[#010a13] transition-all duration-300 hover:bg-lol-gold hover:shadow-lg hover:shadow-lol-gold/20"
    >
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      <span>Registrar</span>
    </Button>
  </form>
);

const FormSwitch = ({
  authType,
  setAuthType,
}: {
  authType: string;
  setAuthType: Function;
}) => (
  <p className={cn("text-center text-sm text-neutral-400", firaCode.className)}>
    {authType === "login" ? "Não possui uma conta?" : "Já tem uma conta?"}
    <Button
      variant="link"
      className="pl-2 text-lol-gold hover:text-lol-gold/80 font-bold"
      onClick={() => setAuthType(authType === "login" ? "register" : "login")}
    >
      {authType === "login" ? "Criar conta" : "Fazer Login"}
    </Button>
  </p>
);

export default AuthPage;
