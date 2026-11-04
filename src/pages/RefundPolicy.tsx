import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function RefundPolicy() {
  const sections = [
    { title: 'Free Plan', body: 'The Free plan costs nothing and is not eligible for refunds. You can downgrade from any paid plan to the Free plan at any time.' },
    { title: 'Pro Plan ($5/month)', body: 'If you are unsatisfied with the Pro plan, you may request a full refund within 7 days of your initial purchase. After 7 days, you can cancel your subscription to prevent future charges, but the current billing period is non-refundable.' },
    { title: 'Enterprise Plan ($49/month)', body: 'Enterprise subscriptions are eligible for a prorated refund within the first 14 days. After 14 days, you may cancel to prevent renewal, but the current billing period is non-refundable. Custom API usage fees are non-refundable once consumed.' },
    { title: 'How to Request a Refund', body: 'To request a refund, contact us at billing@jobcheck.pro with your account email and payment details. Refunds are processed within 5-10 business days to your original payment method.' },
    { title: 'Annual Subscriptions', body: 'Annual Pro and Enterprise subscriptions are eligible for a prorated refund of unused months within the first 30 days. After 30 days, annual subscriptions are non-refundable but can be cancelled to prevent renewal.' },
    { title: 'Circumstances for Denial', body: 'Refunds may be denied in cases of fraud, abuse, or violation of our Terms of Service. If your account is terminated due to policy violations, no refund will be issued for the current billing period.' },
    { title: 'Chargebacks', body: 'We encourage you to contact us before initiating a chargeback. Unwarranted chargebacks may result in account suspension. We will work with you to resolve any billing disputes promptly.' },
  ];

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Legal</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: October 23, 2024</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 mb-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            We want you to be confident in your JobCheck.pro subscription. This Refund Policy explains the conditions under which we issue refunds for paid plans. If you have any questions, please contact our billing team.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-6"
            >
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-emerald-400 text-sm font-mono">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{section.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
