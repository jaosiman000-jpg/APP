'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, useProgress, getSession } from '@/lib/storage';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MetodoPage() {
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

  const getModuleState = (id: number) => {
    if (progress.completedModules.includes(id)) return 'completed';
    if (session?.lastReadModule === id) return 'reading';
    return 'unstarted';
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-serif text-2xl font-medium text-brand-cream">Mi Método</h1>
          <p className="text-brand-muted text-sm mt-1">8 módulos para tu reposicionamiento emocional</p>
        </motion.div>
      </div>

      {/* Module List */}
      <div className="px-5 space-y-3">
        {MODULES.map((mod, i) => {
          const state = getModuleState(mod.id);

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link href={`/metodo/${mod.id}`}>
                <div className={cn(
                  "bg-brand-surface rounded-2xl border p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.99] overflow-hidden relative",
                  state === 'completed' && "border-brand-success/40 border-l-brand-success border-l-[3px]",
                  state === 'reading' && "border-brand-gold/40 border-l-brand-gold border-l-[3px]",
                  state === 'unstarted' && "border-brand-border hover:border-brand-border/80"
                )}>
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    state === 'completed' && "bg-brand-success/20",
                    state === 'reading' && "bg-brand-gold/20",
                    state === 'unstarted' && "bg-brand-bg"
                  )}>
                    {state === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-success" />
                    ) : state === 'reading' ? (
                      <BookOpen className="w-5 h-5 text-brand-gold" />
                    ) : (
                      <FileText className="w-5 h-5 text-brand-dim" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-dim text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      Módulo {mod.id}
                    </p>
                    <h2 className="text-brand-cream text-sm font-medium leading-tight line-clamp-1">
                      {mod.title}
                    </h2>
                    <div className="mt-1.5">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        state === 'completed' && "bg-brand-success/20 text-brand-success",
                        state === 'reading' && "bg-brand-gold/20 text-brand-gold",
                        state === 'unstarted' && "bg-brand-bg text-brand-dim"
                      )}>
                        {state === 'completed' ? 'Completado · PDF' : state === 'reading' ? 'Leyendo · PDF' : 'PDF'}
                      </span>
                    </div>
                  </div>

                  {/* Reading time */}
                  <span className="text-brand-dim text-xs flex-shrink-0">{mod.readingTime}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
