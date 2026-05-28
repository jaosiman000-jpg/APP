'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LifeBuoy, ChevronRight, TrendingUp, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, useProgress, getSession } from '@/lib/storage';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';

const REFLECTIONS = [
  "El amor propio no es egoísmo; es la base de todo amor verdadero.",
  "No puedes controlar las acciones de otro, pero sí tu propia energía.",
  "Tu presencia es lo más poderoso que puedes ofrecer.",
  "La paz interior es tu mayor atractivo.",
  "Cada día es una oportunidad de reescribir tu historia.",
  "La seguridad que proyectas viene de adentro, no de la aprobación externa.",
  "No es perseguir, es atraer. Y para atraer, primero hay que brillar.",
];

export default function InicioPagina() {
  const { session } = useSession();
  const { progress } = useProgress();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s?.email) {
      router.replace('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  if (!mounted || !session) return null;

  const totalModules = MODULES.length;
  const completedCount = progress.completedModules.length;
  const progressPercent = (completedCount / totalModules) * 100;

  // Daily reflection based on day of week
  const dayIndex = new Date().getDay();
  const reflection = REFLECTIONS[dayIndex % REFLECTIONS.length];

  const continueModule = session.lastReadModule
    ? MODULES.find(m => m.id === session.lastReadModule)
    : MODULES[0];

  const isFirstModule = !session.lastReadModule;

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-[calc(2rem+env(safe-area-inset-top))] pb-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-brand-dim text-sm mb-0.5">Buenos días 👋</p>
          <h1 className="font-serif text-2xl font-medium text-brand-cream">
            Hola, {session.name}
          </h1>
        </motion.div>
      </div>

      <div className="px-5 space-y-4">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-muted text-xs font-semibold uppercase tracking-wider">Tu Progreso</span>
            </div>
            <span className="text-brand-gold text-sm font-semibold">{completedCount}/{totalModules}</span>
          </div>
          <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-gold to-brand-goldDark rounded-full"
            />
          </div>
          <p className="text-brand-dim text-xs mt-2">
            {completedCount === 0 ? '¡Empieza tu primera lectura!' : `${completedCount} módulo${completedCount > 1 ? 's' : ''} completado${completedCount > 1 ? 's' : ''}`}
          </p>
        </motion.div>

        {/* Continue / Start Module Card */}
        {continueModule && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link href={`/metodo/${continueModule.id}`}>
              <div className="bg-gradient-to-br from-brand-gold/20 via-brand-goldDark/10 to-transparent rounded-2xl border border-brand-gold/30 p-5 hover:border-brand-gold/50 transition-all duration-200 active:scale-[0.99]">
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                  {isFirstModule ? '✨ Empieza tu método' : '▶ Continúa donde paraste'}
                </span>
                <h2 className="font-serif text-lg font-medium text-brand-cream mt-2 mb-3 line-clamp-2">
                  {continueModule.title}
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-brand-muted text-xs">Módulo {continueModule.id} · {continueModule.readingTime}</span>
                  <div className="flex items-center gap-1 text-brand-gold text-xs font-medium">
                    Abrir módulo
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Quick Access Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link href="/metodo">
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 flex flex-col gap-2 hover:border-brand-gold/30 transition-all duration-200 active:scale-[0.98]">
              <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-gold" />
              </div>
              <span className="text-brand-cream text-sm font-medium">Mi Método</span>
              <span className="text-brand-dim text-xs">8 módulos</span>
            </div>
          </Link>
          <Link href="/sos">
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 flex flex-col gap-2 hover:border-brand-danger/30 transition-all duration-200 active:scale-[0.98]">
              <div className="w-9 h-9 rounded-xl bg-brand-danger/10 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5 text-brand-danger" />
              </div>
              <span className="text-brand-cream text-sm font-medium">SOS Crisis</span>
              <span className="text-brand-dim text-xs">Apoyo inmediato</span>
            </div>
          </Link>
        </motion.div>

        {/* Daily Reflection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5 border-l-2 border-l-brand-gold"
        >
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-muted text-xs font-semibold uppercase tracking-wider">Reflexión del día</span>
          </div>
          <p className="text-brand-cream text-sm leading-relaxed italic">
            &ldquo;{reflection}&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  );
}
