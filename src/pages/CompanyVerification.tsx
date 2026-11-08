import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Globe, Calendar, FileText, Users, ShieldCheck, ShieldX, ExternalLink, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { globalCheck } from '@/global/globalCheck';

export default function CompanyVerification() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  // REAL SSL CHECK - isi file me
  const checkRealSSL = async (domain: string) => {
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      await fetch(`https://${cleanDomain}`, { mode: 'no-cors' });
      return true;
    } catch {
      return false;
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    try {
      const res: any = await globalCheck(query.trim());
      // Real SSL check karke result me daal rahe hai
      const realSSL = await checkRealSSL(res.domain || query.trim());
      setResult({ ...res, ssl: realSSL });
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  const isVerified = result?.score >= 75;

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Company Verification - GLOBAL LIVE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Verify Any Company</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Search for any company to check their domain age, server location, email MX and SSL - Live Global Check.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-2 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search company / domain / email (e.g. google.com)" className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 outline-none" />
            </div>
            <button onClick={handleSearch} disabled={!query.trim() || loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Checking...' : 'Search'}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs text-gray-600">Try:</span>
          {['google.com', 'amazon.com', 'microsoft.com', 'vercel.com'].map((name) => (
            <button key={name} onClick={() => { setQuery(name); }} className="text-xs text-gray-500 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/10 transition-all">{name}</button>
          ))}
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-12 text-center">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Checking live domain records, server location and SSL...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {notFound && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"><XCircle className="w-6 h-6 text-red-400" /></div>
              <h3 className="text-lg font-semibold text-white mb-2">Check failed</h3>
              <p className="text-sm text-gray-500">Domain sahi likh ke fir try karo.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-white/[0.06] relative" style={{ background: isVerified ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 100%)' }}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} border flex items-center justify-center`}>
                      {isVerified ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <ShieldX className="w-7 h-7 text-red-400" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white capitalize">{result.company}</h2>
                      <p className="text-sm text-gray-500 mt-1">{result.domain} • Score: {result.score}/100</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border ${isVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center gap-2">
                      {isVerified ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <span className={`text-sm font-bold ${isVerified ? 'text-emerald-400' : 'text-red-400'}`}>{result.label}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-2xl leading-relaxed">{result.reasons?.length ? result.reasons.join(' • ') : 'Live global verification completed.'}</p>
              </div>
              <div className="p-8">
                <h3 className="text-sm font-semibold text-white mb-4">Verification Details - Live Global</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: 'Official Website', value: result.domain, link: true },
                    { icon: Calendar, label: 'Domain Age', value: result.ageDays !== null && result.ageDays !== undefined ? `${result.ageDays} days old` : 'Not Found' },
                    { icon: FileText, label: 'Server Country', value: result.country || 'Unknown' },
                    { icon: ShieldCheck, label: 'SSL / HTTPS', value: result.ssl ? 'Secure' : 'Not Secure' },
                    { icon: Users, label: 'Trust Score', value: `${result.score} / 100` },
                    { icon: Building2, label: 'Status', value: result.label },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0"><item.icon className="w-4 h-4 text-gray-400" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        {item.link ? (<a href={`https://${result.domain}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-400 flex items-center gap-1">{item.value} <ExternalLink className="w-3 h-3" /></a>) : (<p className="text-sm font-medium text-white">{item.value}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-2">
                  {result.details?.map((d: string, i: number) => (<div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[13px] text-gray-300">{d}</div>))}
                </div>
                {!isVerified && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/15 flex items-start gap-3">
                    <ShieldX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-semibold text-red-300 mb-1">Verification Failed</p><p className="text-xs text-gray-400 leading-relaxed">This company could not be verified through live global records. Proceed with caution.</p></div>
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
          
