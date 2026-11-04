import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    { title: 'Information We Collect', body: 'We collect information you provide directly, including job links you verify, companies you search, and jobs you track. We also collect usage data such as pages visited and features used to improve our service.' },
    { title: 'How We Use Your Information', body: 'We use your data to provide job verification services, maintain your application tracker, send alerts about watched jobs, and improve our scam detection algorithms. We never sell your personal data to third parties.' },
    { title: 'Data Storage & Security', body: 'Your data is stored securely using industry-standard encryption. Job links and verification results are retained to provide history tracking. You can request deletion of your data at any time by contacting us.' },
    { title: 'Cookies & Tracking', body: 'We use essential cookies to maintain your session and preferences. We do not use third-party advertising cookies. Analytics cookies help us understand feature usage to improve the product.' },
    { title: 'Third-Party Services', body: 'We may use third-party services for payment processing (Stripe) and analytics. These services have their own privacy policies governing data they collect independently.' },
    { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. You can export your tracked jobs and verification history at any time. Contact us to exercise these rights.' },
    { title: 'Children\'s Privacy', body: 'JobCheck.pro is intended for job seekers aged 18 and above. We do not knowingly collect information from minors. If you believe a minor has used our service, please contact us immediately.' },
    { title: 'Changes to This Policy', body: 'We may update this policy from time to time. We will notify users of significant changes via email or in-app notification. Continued use of the service constitutes acceptance of the updated policy.' },
  ];

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Legal</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: October 23, 2024</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 mb-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            JobCheck.pro ("we", "us", "our") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have. By using our service, you agree to the practices described below.
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
                <span className="text-blue-400 text-sm font-mono">{String(i + 1).padStart(2, '0')}</span>
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
