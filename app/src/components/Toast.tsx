import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-emerald-500 shadow-emerald-500/30',
  error: 'bg-red-500 shadow-red-500/30',
  info: 'bg-blue-500 shadow-blue-500/30',
};

export default function Toast({ message, type, visible }: ToastProps) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
          className={`fixed bottom-28 left-1/2 ${colors[type]} text-white px-6 py-3 rounded-full text-xs font-bold z-[1000] flex items-center gap-2 shadow-lg`}
        >
          <Icon className="w-4 h-4" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
