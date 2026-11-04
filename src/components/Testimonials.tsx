import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { testimonials } from '@/data/mockData';

export default function Testimonials() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-4"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-gray-300">Real stories from real users</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
          Job seekers who avoided scams
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Over 10,000 job seekers use JobCheck.pro to verify listings before applying. Here's what they found.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col"
          >
            <Quote className="w-8 h-8 text-white/10 mb-4" />
            <p className="text-[15px] text-gray-300 leading-relaxed mb-6 flex-1">
              "{t.quote}"
            </p>
            <div className="pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-white/10 flex items-center justify-center text-xs font-semibold text-blue-300">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-emerald-300 font-medium">{t.saved}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
