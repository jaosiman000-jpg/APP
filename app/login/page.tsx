'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { setSession } from '@/lib/storage';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const router = useRouter();

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const emailError = touched && email && !isValidEmail(email);

  const handleLogin = async () => {
    setTouched(true);
    if (!isValidEmail(email)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // small UX delay

    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    setSession({
      email,
      name,
      loggedInAt: new Date().toISOString(),
      installPromptDismissed: false,
      lastReadModule: null,
    });

    toast.success(`¡Bienvenida, ${name}!`);
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-bg relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-goldDark/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-[72px] h-[72px] rounded-full bg-brand-surface border-2 border-brand-gold/40 overflow-hidden flex items-center justify-center shadow-lg shadow-brand-gold/10 mb-5">
            <img src="/icons/icon-192.png" alt="Logo Reconquista Magnética" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-serif text-[22px] font-medium text-brand-cream tracking-wide text-center">
            Reconquista Magnética
          </h1>
          <p className="text-[13px] text-brand-muted text-center mt-2 leading-relaxed">
            Tu jornada de reposicionamiento emocional
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl shadow-black/20"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <p className="text-brand-cream text-sm font-medium">Accede a tu método</p>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-brand-muted text-xs font-medium mb-2 uppercase tracking-wider">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="tu@correo.com"
                className="w-full bg-brand-bg border border-brand-border rounded-xl pl-10 pr-4 py-3.5 text-brand-cream text-sm placeholder-brand-dim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
              />
            </div>
            {emailError && (
              <p className="mt-1.5 text-brand-danger text-xs">Introduce un correo válido.</p>
            )}
          </div>

          <button
            id="login-btn"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-gold to-brand-goldDark hover:from-brand-goldDark hover:to-brand-gold text-brand-bg font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-brand-gold/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Acceder a mi método
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-brand-dim text-xs mt-6"
        >
          Acceso exclusivo para compradoras
        </motion.p>
      </div>
    </div>
  );
}
