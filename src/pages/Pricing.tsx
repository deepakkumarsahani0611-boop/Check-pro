import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Sparkles, Globe } from 'lucide-react';
import PricingCard from '@/components/PricingCard';
import GlobalTrustLogos from '@/components/GlobalTrustLogos';
import Testimonials from '@/components/Testimonials';
import { pricingPlans } from '@/data/pricingPlans';
import { useGeoPricing } from '@/hooks/useGeoPricing';

interface PricingProps {
  onNavigate: (page: string) => void;
}

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, cancel with one click. Your plan stays active until the end of the billing period.' },
  { q: 'What counts as a verification?', a: 'Each job link you run through the full 5-point check counts as one verification. Free includes 5 per month and Pro includes 500.' },
  { q: 'Is the API available on Pro?', a: 'API access is included in Enterprise. Pro includes real-time alerts and PDF exports in the dashboard.' },
  { q: 'How do rupee prices work?', a: 'If we detect that you are visiting from India, Pro is shown at ₹199 per month or ₹149 per month billed annually. Everyone else sees USD pricing.' },
  { q: 'Do you store my job links?', a: 'We store links you verify and watch to provide history tracking and alerts. We never share your data with third parties.' },
];

export default function Pricing({ onNavigate }: PricingProps) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { currency } = useGeoPricing();

  const handlePlanCta = (planId: string) => {
     if (planId === 'free') onNavigate('home');
    if (planId === 'enterprise') onNavigate('contact');
    if (planId === 'pro') window.open('https://rzp.io/rzp/Oq70Cd3f', '_blank');
  };   

  return (
    <div className="relative bg-[#0A0A0B] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[720px] grid-bg pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-gray-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-5">
            Verify every job for less<br className="hidden md:block" /> than a coffee a month
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Start free, upgrade when you need more. Every plan includes the core 5-point verification engine.
          </p>

          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            {[
              { id: 'monthly', label: 'Monthly', active: !annual, onClick: () => setAnnual(false) },
              { id: 'annual', label: 'Annual', active: annual, onClick: () => setAnnual(true) },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={opt.onClick}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  opt.active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {opt.active && (
                  <motion.span
                    layoutId="billing-toggle"
                    className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {opt.label}
                  {opt.id === 'annual' && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      Save 20%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 mt-4">
            <Globe className="w-3 h-3" />
            Pricing shown for your region
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto pt-4">
          {pricingPlans.map((plan, i) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currency={currency}
              annual={annual}
              index={i}
              onCta={() => handlePlanCta(plan.id)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 glass-card rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Building2, label: 'Companies Verified', value: '8,400+' },
              { icon: TrendingUp, label: 'Jobs Analyzed', value: '142,000+' },
              { icon: Sparkles, label: 'Scams Blocked', value: '2,543' },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <GlobalTrustLogos />
      <Testimonials />

      <div className="relative max-w-3xl mx-auto px-6 pb-32">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="glass-card glass-card-hover rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl text-gray-500 leading-none"
                >
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
