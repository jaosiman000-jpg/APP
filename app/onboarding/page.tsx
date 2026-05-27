'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Smartphone, Apple, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { isIOS, isAndroid } from '@/lib/platform';
import { getSession, setSession } from '@/lib/storage';
import { toast } from 'sonner';

type Platform = 'ios' | 'android';

export default function OnboardingPage() {
  const [platform, setPlatform] = useState<Platform>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (isIOS()) {
      setPlatform('ios');
    } else {
      setPlatform('android');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const handleDismiss = () => {
    const session = getSession();
    if (session) {
      setSession({ ...session, installPromptDismissed: true });
    }
    router.push('/inicio');
  };

  const handleInstalled = () => {
    const session = getSession();
    if (session) {
      setSession({ ...session, installPromptDismissed: true });
    }
    toast.success('¡Genial! Ya tienes la app instalada.');
    router.push('/inicio');
  };

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      handleInstalled();
    }
  };

  const iosSteps = [
    { num: 1, text: 'Toca el botón compartir', emoji: '□↑', detail: 'en la barra inferior del navegador' },
    { num: 2, text: "Desliza y selecciona", emoji: '➕', detail: '"Añadir a pantalla de inicio"' },
    { num: 3, text: 'Toca "Añadir"', emoji: '✓', detail: 'en la esquina superior derecha' },
  ];

  const androidSteps = [
    { num: 1, text: 'Toca el menú', emoji: '⋮', detail: 'en la esquina superior derecha' },
    { num: 2, text: 'Selecciona', emoji: '📲', detail: '"Añadir a pantalla de inicio"' },
    { num: 3, text: 'Confirma y listo', emoji: '✓', detail: 'toca "Añadir" en la ventana emergente' },
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-brand-bg relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-gold/30 flex items-center justify-center mb-4 shadow-lg shadow-brand-gold/10">
            <Heart className="w-7 h-7 text-brand-gold fill-brand-gold/30" />
          </div>
          <h1 className="font-serif text-xl font-medium text-brand-cream text-center">
            Instala la app
          </h1>
          <p className="text-brand-muted text-sm text-center mt-1.5">
            Accede sin internet y siempre a mano
          </p>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5 mb-4 shadow-lg"
        >
          <div className="flex gap-2 mb-5 bg-brand-bg rounded-xl p-1">
            <button
              onClick={() => setPlatform('android')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                platform === 'android'
                  ? 'bg-brand-gold text-brand-bg shadow-sm'
                  : 'text-brand-muted hover:text-brand-cream'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android
            </button>
            <button
              onClick={() => setPlatform('ios')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                platform === 'ios'
                  ? 'bg-brand-gold text-brand-bg shadow-sm'
                  : 'text-brand-muted hover:text-brand-cream'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              iPhone
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex gap-3 items-start"
              >
                <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-brand-gold text-xs font-bold">{step.num}</span>
                </div>
                <div>
                  <p className="text-brand-cream text-sm font-medium">{step.text} <span className="text-brand-gold">{step.emoji}</span></p>
                  <p className="text-brand-dim text-xs mt-0.5">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Native install button for Android */}
          {deferredPrompt && platform === 'android' && (
            <button
              onClick={handleNativeInstall}
              className="w-full mt-4 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-brand-gold/30 transition-colors active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Instalar ahora
            </button>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          <button
            id="installed-btn"
            onClick={handleInstalled}
            className="w-full bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-bg font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md shadow-brand-gold/20"
          >
            <Check className="w-4 h-4" />
            Ya instalé
          </button>
          <button
            id="dismiss-btn"
            onClick={handleDismiss}
            className="w-full border border-brand-border text-brand-muted rounded-xl py-3 text-sm hover:text-brand-cream hover:border-brand-gold/30 transition-colors active:scale-[0.98]"
          >
            Recordar después
          </button>
        </motion.div>
      </div>
    </div>
  );
}
