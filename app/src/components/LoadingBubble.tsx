import { motion } from 'framer-motion';

export default function LoadingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="msg-container ai-msg flex items-center gap-3 min-h-[60px]">
        <motion.span
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2.5 h-2.5 rounded-full bg-blue-500"
        />
        <motion.span
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          className="w-2.5 h-2.5 rounded-full bg-purple-500"
        />
        <motion.span
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          className="w-2.5 h-2.5 rounded-full bg-indigo-500"
        />
        <span className="text-[10px] opacity-40 ml-2 font-medium">BMS AI sedang berpikir...</span>
      </div>
    </motion.div>
  );
}
