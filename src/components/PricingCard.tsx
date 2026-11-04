import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { priceFor, type PricingPlan } from '@/data/pricingPlans';
import type { Currency } from '@/hooks/useGeoPricing';

interface PricingCardProps {
  plan: PricingPlan;
  currency: Currency;
  annual: boolean;
  index: number;
  onCta: () => void;
}

export default function PricingCard({ plan, currency, annual, index, onCta }: PricingCardProps) {
  const price = priceFor(plan, currency, annual);
  const billedAnnually = annual && plan.annual !== null;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative h-full flex flex-col rounded-2xl overflow-hidden glass-card glass-card-hover ${
        plan.highlighted
          ? '!border-blue-500/40 bg-gradient-to-b from-blue-500/[0.08] via-white/[0.02] to-transparent shadow-[0_0_80px_-12px_rgba(59,130,246,0.5)]'
          : ''
      }`}
    >
      {plan.highlighted && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
      )}

      <div className={plan.highlighted ? 'p-8 md:p-9' : 'p-8'}>
        <div className="flex items-center justify-between mb-6">
          <div className={`w-11 h-11 rounded-xl ${plan.accent.soft} border ${plan.accent.border} flex items-center justify-center`}>
            <plan.icon className={`w-5 h-5 ${plan.accent.text}`} />
          </div>
          {plan.highlighted && (
            <span className="shine-btn inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500 text-[11px] font-semibold text-white tracking-wide shadow-lg shadow-blue-500/40">
              Most Popular
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
        <p className="text-xs text-gray-500 mt-1 mb-6">{plan.tagline}</p>

        <div className="flex items-baseline gap-2 min-h-[64px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="text-5xl font-bold tracking-tight text-white"
            >
              {price}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-gray-500">{plan.unit}</span>
        </div>
        <p className={`text-xs mt-2 mb-7 h-4 ${billedAnnually ? 'text-emerald-400' : 'text-transparent'}`}>
          Billed annually
        </p>

        <button
          onClick={onCta}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all mb-8 ${
            plan.highlighted
              ? 'shine-btn bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25'
              : plan.id === 'enterprise'
              ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300'
              : 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white'
          }`}
        >
          {plan.cta}
        </button>

        <ul className="space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className={`w-4 h-4 rounded-full ${plan.accent.soft} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Check className={`w-2.5 h-2.5 ${plan.accent.text}`} />
              </span>
              <span className="text-[13px] text-gray-300 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  if (!plan.highlighted) return card;

  return (
    <div className="relative h-full md:scale-[1.04] md:z-10 order-first md:order-none">
      {card}
    </div>
  );
}
