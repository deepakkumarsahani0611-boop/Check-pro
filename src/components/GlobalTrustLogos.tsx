import { motion } from 'framer-motion';

const platforms = [
  { name: 'Naukri', logo: 'Naukri' },
  { name: 'LinkedIn', logo: 'LinkedIn' },
  { name: 'Indeed', logo: 'Indeed' },
  { name: 'Glassdoor', logo: 'Glassdoor' },
];

export default function GlobalTrustLogos() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-14">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-8">
          As seen protecting users from scams on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="grayscale opacity-40 hover:opacity-70 hover:grayscale-0 transition-all duration-300"
            >
              <span className="text-lg font-bold text-gray-400 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                {p.logo}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
