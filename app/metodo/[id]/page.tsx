'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, FileText, Clock, CheckCircle2, Download, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, useProgress, getSession } from '@/lib/storage';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ModuleDetailPage() {
  const { session } = useSession();
  const { progress, setProgress } = useProgress();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  const moduleId = Number(params.id);
  const mod = MODULES.find(m => m.id === moduleId);

  useEffect(() => {
    const s = getSession();
    if (!s?.email) {
      router.replace('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  if (!mounted || !session || !mod) return null;

  const isCompleted = progress.completedModules.includes(mod.id);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-sm border-b border-brand-border px-5 py-4 flex items-center gap-3">
        <Link href="/metodo">
          <button className="w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center border border-brand-border transition-all active:scale-[0.9]">
            <ChevronLeft className="w-4 h-4 text-brand-cream" />
          </button>
        </Link>
        <div>
          <p className="text-brand-dim text-[10px] font-bold uppercase tracking-widest">Mi Método</p>
          <p className="text-brand-cream text-sm font-medium">Módulo {mod.id}</p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-5">
        {/* Tag + Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Módulo {mod.id} de 8
          </span>
          <h1 className="font-serif text-2xl font-medium text-brand-cream mt-4 leading-tight">
            {mod.title}
          </h1>
        </motion.div>

        {/* Metadata Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-gold" />
            </div>
            <p className="text-brand-muted text-xs">Formato</p>
            <p className="text-brand-cream text-sm font-medium">PDF · {mod.readingTime}</p>
          </div>
          <div className={cn(
            "rounded-2xl border p-4 flex flex-col gap-2",
            isCompleted ? "bg-brand-success/10 border-brand-success/30" : "bg-brand-surface border-brand-border"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isCompleted ? "bg-brand-success/20" : "bg-brand-gold/10"
            )}>
              {isCompleted
                ? <CheckCircle2 className="w-4 h-4 text-brand-success" />
                : <FileText className="w-4 h-4 text-brand-gold" />
              }
            </div>
            <p className="text-brand-muted text-xs">Estado</p>
            <p className={cn("text-sm font-medium", isCompleted ? "text-brand-success" : "text-brand-cream")}>
              {isCompleted ? 'Completado' : 'No iniciado'}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <Link href={`/metodo/${mod.id}/leer`}>
            <button className="w-full bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-bg font-semibold rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md shadow-brand-gold/20">
              <BookOpen className="w-4 h-4" />
              Abrir PDF
            </button>
          </Link>
          <a href={mod.pdfPath} download={`modulo-${mod.id}.pdf`}>
            <button className="w-full border border-brand-border text-brand-muted rounded-xl py-3 text-sm flex items-center justify-center gap-2 hover:text-brand-cream hover:border-brand-gold/30 transition-colors active:scale-[0.98]">
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
