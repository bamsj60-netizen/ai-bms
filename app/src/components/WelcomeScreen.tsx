import { motion } from 'framer-motion';
import { Zap, ShoppingCart, Gamepad2 } from 'lucide-react';

interface WelcomeScreenProps {
  onQuickMessage: (msg: string) => void;
}

export default function WelcomeScreen({ onQuickMessage }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-4xl mx-auto py-12 text-center space-y-10"
    >
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
        className="space-y-6"
      >
        <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl border border-white/20 animate-float">
          <Zap className="w-14 h-14 text-white" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-5xl md:text-7xl font-black font-outfit tracking-tighter leading-none"
        >
          BMS AI <br />
          <span className="gradient-text">PROFESSIONAL</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-xl mx-auto text-sm opacity-50 font-medium"
        >
          Asisten cerdas multimodal bertenaga BMS STUDIO & STORE. 
          Didukung oleh 25+ model AI termasuk GPT, Claude, Gemini, Grok, Llama, Kimi, dan banyak lagi.
        </motion.p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
      >
        <motion.div
          whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onQuickMessage('Lihat daftar produk BMS STORE')}
          className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all"
        >
          <ShoppingCart className="text-blue-500 mb-4 text-3xl w-10 h-10" />
          <h3 className="text-[12px] font-black uppercase mb-1">BMS STORE</h3>
          <p className="text-[11px] opacity-40">Produk Digital & Topup Game.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onQuickMessage('Apa saja jasa di BMS STUDIO?')}
          className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-purple-500/30 cursor-pointer transition-all"
        >
          <Gamepad2 className="text-purple-500 mb-4 text-3xl w-10 h-10" />
          <h3 className="text-[12px] font-black uppercase mb-1">BMS STUDIO</h3>
          <p className="text-[11px] opacity-40">Roblox Dev & Scripting Service.</p>
        </motion.div>
      </motion.div>

      {/* Quick Prompts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
      >
        {[
          'Jelaskan tentang AI',
          'Buatkan code Python',
          'Tips game Roblox',
          'Produk BMS STORE'
        ].map((prompt, i) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickMessage(prompt)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold hover:bg-white/10 hover:border-blue-500/30 transition-all"
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
