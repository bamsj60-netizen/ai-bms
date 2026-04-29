import { motion } from 'framer-motion';
import { Menu, Shield } from 'lucide-react';

interface ChatHeaderProps {
  modelName: string;
  onToggleSidebar: () => void;
}

export default function ChatHeader({ modelName, onToggleSidebar }: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-16 lg:h-20 glass flex items-center justify-between px-6 md:px-10 z-20 border-b border-white/5 shrink-0"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-all"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <div>
          <h2 className="text-[9px] font-black tracking-[0.2em] opacity-30">
            TERMINAL AKTIF
          </h2>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 bg-green-500 rounded-full glow-green"
            />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {modelName}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-blue-500"
      >
        <Shield className="w-5 h-5" />
      </motion.div>
    </motion.header>
  );
}
