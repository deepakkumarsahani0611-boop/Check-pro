import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Loader2, CheckCircle2, Phone, Clock } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const contactMethods = [
    { icon: Mail, label: 'Email', value: 'support@jobcheck.pro', href: 'mailto:support@jobcheck.pro' },
    { icon: Phone, label: 'Phone', value: '+91 80 4567 8900', href: '#' },
    { icon: MapPin, label: 'Office', value: 'Bengaluru, Karnataka, India', href: '#' },
    { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9 AM - 6 PM IST', href: '#' },
  ];

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Get in touch</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Questions, feedback, or need to report a fake job? We're here to help. Reach out and we'll respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card glass-card-hover rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{method.label}</p>
                    <p className="text-sm font-medium text-white truncate">{method.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">Message sent!</h3>
                  <p className="text-sm text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={5}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name.trim() || !form.email.trim() || !form.message.trim() || status === 'sending'}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all"
                  >
                    {status === 'sending' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
