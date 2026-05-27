'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wind, AlertCircle, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { AudioPlayer } from '@/components/audio-player';
import { getSession } from '@/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const REMINDERS = [
  "No actúes desde el dolor. Actúa desde la claridad.",
  "Tu reacción de hoy define el camino de mañana.",
  "Lo que sientes es válido. Lo que hagas a continuación importa.",
];

export default function SosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showHeadphonesAlert, setShowHeadphonesAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session?.email) {
      router.replace('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  const handlePlay = () => {
    if (!hasShownAlert) {
      setShowHeadphonesAlert(true);
      setHasShownAlert(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-serif text-2xl font-medium text-brand-cream">SOS Crisis</h1>
          <p className="text-brand-muted text-sm mt-1">Un espacio para respirar antes de actuar</p>
        </motion.div>
      </div>

      <div className="px-5 space-y-4">
        {/* Breathe First */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wind className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">Respira primero</span>
          </div>
          <p className="text-brand-cream text-sm leading-relaxed">
            Antes de enviar ese mensaje o tomar una decisión, date un momento. 
            Tu estado emocional ahora mismo no es el mejor consejero. 
            Escucha el audio de apoyo y vuelve a ti misma.
          </p>
        </motion.div>

        {/* Audio Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-brand-gold/15 via-brand-goldDark/10 to-transparent rounded-2xl border border-brand-gold/30 p-5"
        >
          <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">Audio de apoyo</span>
          <h2 className="font-serif text-lg font-medium text-brand-cream mt-2 mb-5">
            Pausa antes de reaccionar
          </h2>
          <AudioPlayer src="/audios/sos-principal.mp3" title="Pausa antes de reaccionar" onPlay={handlePlay} />
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5"
        >
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mb-3">Recuerda</p>
          <div className="space-y-3">
            {REMINDERS.map((reminder, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-brand-gold text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-brand-cream text-sm leading-relaxed">{reminder}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-brand-danger/30 border-l-brand-danger border-l-[3px] bg-brand-danger/5 p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-brand-danger flex-shrink-0 mt-0.5" />
            <p className="text-brand-muted text-xs leading-relaxed">
              Si estás pasando por una crisis emocional grave o pensamientos que te preocupan, 
              busca ayuda profesional. Esta app no sustituye atención psicológica.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Headphones Popup */}
      <Dialog open={showHeadphonesAlert} onOpenChange={setShowHeadphonesAlert}>
        <DialogContent className="bg-brand-surface border-brand-border text-brand-cream mx-4 rounded-2xl max-w-sm">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-3">
              <Headphones className="w-6 h-6 text-brand-gold" />
            </div>
            <DialogTitle className="font-serif text-lg text-brand-cream">
              Mejor con auriculares
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-brand-muted text-sm text-center">
            Usa auriculares para una mejor experiencia.
          </DialogDescription>
          <div className="mt-2">
            <button
              onClick={() => setShowHeadphonesAlert(false)}
              className="w-full bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-bg font-semibold rounded-xl py-2.5 text-sm transition-all duration-200 active:scale-[0.98] shadow-md shadow-brand-gold/20"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
