// src/pages/CompanyVerification.tsx - 100% REAL - SUPER DUPER PROFESSIONAL GLOBAL LEVEL - NO DUMMY
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Globe, Calendar, FileText, ShieldCheck, ShieldX, ExternalLink, Building2, CheckCircle2, XCircle, MapPin, Server } from 'lucide-react';
import { verifyCompanyReal } from '../lib/worldCheck';

export default function CompanyVerification() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (value?: string) => {
    const searchValue = (value || query).trim();
    if (!searchValue) { setError('Company ya Domain daalo - jaise google.com'); return; }
    if (searchValue.length < 2) { setError('Sahi Company / Domain daalo'); return; }
    setQuery(searchValue);
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res: any = await verifyCompanyReal(searchValue);
      setResult(res);
      const h = JSON.parse(localStorage.getItem('check_history')||'[]');
      localStorage.setItem('check_history', JSON.stringify([{...res, input: searchValue, date: new Date().toLocaleString()}, ...h].slice(0,50)));
    } catch {
      setError('Check fail ho gaya - sahi domain daal ke fir try karo');
    }
    setLoading(false);
  };

  // 100% SAME THRESHOLD - FakeJobChecker + Home jaisa - 70 / 40
  const getColor = (s:number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const getLabel = (s:number) => s >= 70 ? 'VERIFIED / SAFE' : s >= 40 ? 'SUSPICIOUS / CAUTION' : 'NOT VERIFIED / HIGH RISK';
  const isVerified = (result?.score || 0) >= 70;

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Company Verification - GLOBAL LIVE - 100% REAL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Verify Any Company</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Koi bhi company / domain daalo - Google ho ya nayi company - Live Real SSL, Domain Age, Country, IP check hoga.</p>
        </motion.div>

        <div className="glass-card rounded-2xl p-2 mb-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input type="text" value={query} onChange={(e) => {setQuery(e.target.value); setError('');}} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search company / domain - e.g. google.com, zerodha.com" className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 outline-none" />
            </div>
            <button onClick={() => handleSearch()} disabled={!query.trim() || loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Checking...' : 'VERIFY NOW'}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 text-center mb-4">{error}</p>}

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs text-gray-600">Try:</span>
          {['google.com', 'amazon.com', 'microsoft.com', 'zerodha.com'].map((name) => (
            <button key={name} onClick={() => handleSearch(name)} className="text-xs text-gray-500 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 hover:border-white/10 transition-all">{name}</button>
          ))}
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-12 text-center">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-white">Real Check Chal Raha Hai...</p>
              <p className="text-xs text-gray-500 mt-1">Checking real SSL, real domain age, real country, real IP</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-white/[0.06] relative" style={{ background: isVerified ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 100%)' }}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl border flex items-center justify-center" style={{ background: getColor(result.score)+'1A', borderColor: getColor(result.score)+'33' }}>
                      {isVerified ? <ShieldCheck className="w-7 h-7" style={{color: getColor(result.score)}} /> : <ShieldX className="w-7 h-7" style={{color: getColor(result.score)}} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white capitalize">{result.company || result.domain}</h2>
                      <p className="text-sm text-gray-500 mt-1">{result.domain} • Score: {result.score}/100</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl border" style={{ background: getColor(result.score)+'1A', borderColor: getColor(result.score)+'33' }}>
                    <div className="flex items-center gap-2">
                      {isVerified ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                      <span className="text-sm font-bold" style={{color: getColor(result.score)}}>{getLabel(result.score)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 max-w-2xl leading-relaxed">{result.reasons?.length ? result.reasons.join(' • ') : result.label || 'Live global verification completed.'}</p>
              </div>
              <div className="p-8">
                <h3 className="text-sm font-semibold text-white mb-4">Verification Details - Live Global - 100% Real</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: Globe, label: 'Official Website', value: result.domain, link: true },
                    { icon: Calendar, label: 'Domain Age', value: result.ageDays !== null && result.ageDays !== undefined ? `${result.ageDays} days old` : 'Unknown' },
                    { icon: FileText, label: 'Created On', value: result.created || 'Unknown' },
                    { icon: MapPin, label: 'Server Country', value: result.country || 'Unknown' },
                    { icon: Server, label: 'Server IP', value: result.ip || 'Unknown' },
                    { icon: ShieldCheck, label: 'SSL / HTTPS', value: result.ssl ? `Secure - ${result.issuer || 'Valid'}` : 'Not Secure' },
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
                    <div><p className="text-sm font-semibold text-red-300 mb-1">Verification Failed / Caution</p><p className="text-xs text-gray-400 leading-relaxed">This company could not be fully verified through live global records. Proceed with caution - paisa ya document mat bhejo jab tak khud confirm na kar lo.</p></div>
                  </div>
                )}
                <p className="text-[11px] text-gray-600 mt-4">Source: crt.sh + RDAP + DNS - 100% Real Data, No Dummy</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
