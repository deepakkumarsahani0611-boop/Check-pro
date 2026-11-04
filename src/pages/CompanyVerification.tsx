import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Globe, Calendar, FileText, Users, ShieldCheck, ShieldX, ExternalLink, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { companies } from '@/data/mockData';
import type { CompanyInfo } from '@/data/mockData';

export default function CompanyVerification() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanyInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setTimeout(() => {
      const key = query.toLowerCase().trim();
      const found = companies[key] || Object.values(companies).find(c => c.name.toLowerCase().includes(key));
      if (found) {
        setResult(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 1500);
  };

  const isVerified = result?.trustBadge === 'Verified';

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Company Verification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Verify Any Company
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Search for any company to check their official website, domain age, legal status, GST registration, and employee count.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-2 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search company name (e.g. Vercel, Google, Razorpay)..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </motion.div>

        {/* Quick picks */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs text-gray-600">Try:</span>
          {['Vercel', 'Google', 'Razorpay', 'QuickHire'].map((name) => (
            <button
              key={name}
              onClick={() => { setQuery(name); }}
              className="text-xs text-gray-500 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/10 transition-all"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-12 text-center"
            >
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Searching business registries, domain records, and public databases...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not Found */}
        <AnimatePresence>
          {notFound && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No records found</h3>
              <p className="text-sm text-gray-500">This company has no verifiable public records. This is a major red flag — proceed with extreme caution.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Banner */}
              <div
                className="p-8 border-b border-white/[0.06] relative"
                style={{ background: isVerified ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 100%)' }}
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} border flex items-center justify-center`}>
                      {isVerified ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <ShieldX className="w-7 h-7 text-red-400" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{result.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{result.industry}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center gap-2">
                      {isVerified ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <span className={`text-sm font-bold ${isVerified ? 'text-emerald-400' : 'text-red-400'}`}>{result.trustBadge}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-2xl leading-relaxed">{result.description}</p>
              </div>

              {/* Details */}
              <div className="p-8">
                <h3 className="text-sm font-semibold text-white mb-4">Verification Details</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: 'Official Website', value: result.website, link: true },
                    { icon: Calendar, label: 'Domain Age', value: result.domainAge },
                    { icon: FileText, label: 'GST / Tax ID', value: result.gstNumber },
                    { icon: ShieldCheck, label: 'Legal Status', value: result.legalStatus },
                    { icon: Users, label: 'Employee Count', value: result.employeeCount },
                    { icon: Building2, label: 'Founded', value: result.founded },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        {item.link ? (
                          <span className="text-sm font-medium text-blue-400 flex items-center gap-1">
                            {item.value} <ExternalLink className="w-3 h-3" />
                          </span>
                        ) : (
                          <p className="text-sm font-medium text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Warning for unverified */}
                {!isVerified && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/15 flex items-start gap-3">
                    <ShieldX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300 mb-1">Verification Failed</p>
                      <p className="text-xs text-gray-400 leading-relaxed">This company could not be verified through public records. Domain is recently registered with no business registration found. Avoid applying to jobs from this company.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
