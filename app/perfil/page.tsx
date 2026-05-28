'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Bell, FileText, LogOut, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession, useProgress, setSession as storageSetSession, getSession } from '@/lib/storage';
import { MODULES } from '@/lib/modules';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ModalKey = 'warranty' | 'terms' | null;

export default function PerfilPage() {
  const { session, setSession } = useSession();
  const { progress } = useProgress();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s?.email) {
      router.replace('/login');
      return;
    }
    setMounted(true);
    if ('Notification' in window) {
      setNotifEnabled(Notification.permission === 'granted');
    }
  }, [router]);

  if (!mounted || !session) return null;

  const completedCount = progress.completedModules.length;
  const totalModules = MODULES.length;
  const progressPercent = (completedCount / totalModules) * 100;
  const initial = (session.name || session.email).charAt(0).toUpperCase();

  const handleNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Tu navegador no soporta notificaciones.');
      return;
    }
    if (Notification.permission === 'granted') {
      toast.info('Las notificaciones ya están activadas.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      toast.success('¡Notificaciones activadas!');
    } else {
      toast.error('Permiso de notificaciones denegado.');
    }
  };

  const handleLogout = () => {
    storageSetSession(null);
    localStorage.removeItem('rm_progress');
    toast.success('Sesión cerrada.');
    router.replace('/login');
  };

  const menuItems = [
    {
      id: 'warranty',
      icon: Shield,
      label: 'Garantía de 7 días',
      desc: 'Política de reembolso',
      onClick: () => setOpenModal('warranty'),
      color: 'text-brand-gold',
    },
    {
      id: 'support',
      icon: Mail,
      label: 'Soporte por correo',
      desc: 'advjoaosiman@gmail.com',
      onClick: () => { window.location.href = 'mailto:advjoaosiman@gmail.com'; },
      color: 'text-brand-muted',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notificaciones',
      desc: notifEnabled ? 'Activadas' : 'Desactivadas',
      onClick: handleNotifications,
      color: 'text-brand-muted',
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'Términos y privacidad',
      desc: 'Información legal',
      onClick: () => setOpenModal('terms'),
      color: 'text-brand-muted',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-[calc(2rem+env(safe-area-inset-top))] pb-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-serif text-2xl font-medium text-brand-cream">Mi Perfil</h1>
        </motion.div>
      </div>

      <div className="px-5 space-y-4">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold to-brand-goldDark flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-gold/20">
            <span className="font-serif text-2xl font-bold text-brand-bg">{initial}</span>
          </div>
          <div>
            <h2 className="text-brand-cream font-medium text-base">{session.name}</h2>
            <p className="text-brand-dim text-sm">{session.email}</p>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-brand-surface rounded-2xl border border-brand-border p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-gold" />
              <span className="text-brand-muted text-xs font-bold uppercase tracking-wider">Tu Avance</span>
            </div>
            <span className="text-brand-gold text-sm font-semibold">{completedCount}/{totalModules} módulos</span>
          </div>
          <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-gold to-brand-goldDark rounded-full"
            />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden"
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 transition-all duration-150 active:bg-brand-border/30 text-left",
                  i < menuItems.length - 1 && "border-b border-brand-border"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center flex-shrink-0", item.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-brand-cream text-sm font-medium">{item.label}</p>
                  <p className="text-brand-dim text-xs">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-dim" />
              </button>
            );
          })}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="w-full bg-brand-surface border border-brand-danger/30 text-brand-danger rounded-2xl py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:bg-brand-danger/10"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-brand-dim text-xs pb-4">Reconquista Magnética · v1.0</p>
      </div>

      {/* Warranty Modal */}
      <Dialog open={openModal === 'warranty'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="bg-brand-surface border-brand-border text-brand-cream mx-4 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-brand-cream flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-gold" />
              Garantía de 7 días
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-brand-muted text-sm leading-relaxed">
            Ofrecemos garantía total de devolución durante los primeros 7 días desde tu compra.
            Si no estás satisfecha con el contenido por cualquier motivo, contacta a nuestro equipo
            de soporte y procesaremos tu reembolso sin preguntas dentro de las 48 horas hábiles siguientes.
            Para solicitar el reembolso, escríbenos a advjoaosiman@gmail.com con el asunto
            "Solicitud de reembolso" y el correo con el que realizaste la compra.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Terms Modal */}
      <Dialog open={openModal === 'terms'} onOpenChange={() => setOpenModal(null)}>
        <DialogContent className="bg-brand-surface border-brand-border text-brand-cream mx-4 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-brand-cream flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-gold" />
              Términos y Privacidad
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-brand-muted text-sm leading-relaxed">
            <div className="space-y-3 mt-1">
              <p><strong className="text-brand-cream">Uso de datos:</strong> Esta aplicación no almacena ningún dato en servidores externos. Toda la información (correo, progreso) se guarda localmente en tu dispositivo.</p>
              <p><strong className="text-brand-cream">Contenido:</strong> El material de esta app es para uso personal exclusivo. Queda prohibida su distribución, reproducción o venta sin autorización expresa.</p>
              <p><strong className="text-brand-cream">Limitación:</strong> Este programa es de desarrollo personal y no sustituye la atención psicológica o médica profesional.</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
