import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Ban } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="w-full border-b border-white/[0.06] bg-gradient-to-r from-blue-600/[0.08] via-blue-600/[0.04] to-blue-600/[0.08] backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-2.5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 text-center"
        >
          <Rocket className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-200 whitespace-nowrap">
            Trusted by <span className="text-white font-semibold">10,000+</span> job seekers
            <span className="text-gray-700 mx-2">|</span>
            <Ban className="w-3 h-3 text-red-400 inline-block mr-1 align-middle" />
            <span className="text-red-400 font-semibold">2,543</span> fake jobs blocked this month
          </span>
        </motion.div>
      </div>
    </div>
  );
}
