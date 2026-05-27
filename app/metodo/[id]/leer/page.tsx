'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Download, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSession, useProgress, getSession } from '@/lib/storage';
import { MODULES } from '@/lib/modules';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer').then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#0d0709] min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      <p className="text-brand-dim text-sm">Cargando módulo...</p>
    </div>
  ),
});

export default function LeerPage() {
  const { session } = useSession();
  const { progress, setProgress } = useProgress();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 0 });

  const moduleId = Number(params.id);
  const mod = MODULES.find(m => m.id === moduleId);

  useEffect(() => {
    setMounted(true);
    const s = getSession();
    if (!s?.email) {
      router.replace('/login');
      return;
    }
    // Track last read module in session
    if (s && moduleId) {
      setProgress({ currentModule: moduleId });
      import('@/lib/storage').then(({ getSession: gs, setSession: ss }) => {
        const current = gs();
        if (current) ss({ ...current, lastReadModule: moduleId });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = useCallback((current: number, total: number) => {
    setPageInfo({ current, total });
  }, []);

  if (!mounted || !mod) return null;

  const isCompleted = progress.completedModules.includes(mod.id);

  const markAsCompleted = () => {
    if (isCompleted) return;
    const newCompleted = [...progress.completedModules, mod.id];
    setProgress({ completedModules: newCompleted });
    toast.success('¡Módulo completado! 🎉', {
      description: `Módulo ${mod.id}: ${mod.title}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0709]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link href={`/metodo/${mod.id}`}>
            <button className="w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center border border-brand-border transition-all active:scale-[0.9] flex-shrink-0">
              <ChevronLeft className="w-4 h-4 text-brand-cream" />
            </button>
          </Link>
          <div className="min-w-0">
            <p className="text-brand-dim text-[10px] font-bold uppercase tracking-widest">Módulo {mod.id}</p>
            <p className="text-brand-cream text-sm font-medium truncate">{mod.title}</p>
          </div>
        </div>
        <a href={mod.pdfPath} download={`modulo-${mod.id}.pdf`}>
          <button className="ml-2 w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center border border-brand-border text-brand-dim hover:text-brand-cream transition-all active:scale-[0.9]">
            <Download className="w-4 h-4" />
          </button>
        </a>
      </div>

      {/* PDF Content */}
      <div className="flex-1">
        <PdfViewer url={mod.pdfPath} onPageChange={handlePageChange} />
      </div>

      {/* Complete Button */}
      <div className="sticky bottom-0 z-10 bg-brand-bg/95 backdrop-blur-sm border-t border-brand-border px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          id="complete-btn"
          onClick={markAsCompleted}
          disabled={isCompleted}
          className={cn(
            "w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]",
            isCompleted
              ? "bg-brand-success/20 border border-brand-success/40 text-brand-success cursor-default"
              : "border border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isCompleted ? '✓ Completado' : 'Marcar como completado'}
        </button>
      </div>
    </div>
  );
}
