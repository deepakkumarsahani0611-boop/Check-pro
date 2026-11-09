// src/pages/Alerts.tsx - 100% REAL - NO MOCK - NO DUMMY - GLOBAL PROFESSIONAL
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Globe, Eye, Search, Loader2, RefreshCw, Clock, AlertTriangle, Info, XCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { verifyCompanyReal } from '../lib/worldCheck';

type AlertItem = { id: string; jobTitle: string; company: string; message: string; severity: 'info'|'warning'|'danger'; type: string; timestamp: string; score: number };

const severityConfig: any = {
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
  danger: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [watching, setWatching] = useState(true);
  const [watchInput, setWatchInput] = useState('');
  const [watchList, setWatchList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // REAL - Apne khud ke checks se alerts banao - koi mock nahi
  useEffect(() => {
    const savedWatch = JSON.parse(localStorage.getItem('watch_list') || '[]');
    setWatchList(savedWatch);
    const h = JSON.parse(localStorage.getItem('check_history') || '[]');
    const realAlerts: AlertItem[] = h.slice(0, 10).map((x: any, i: number) => ({
      id: `real-${i}-${x.domain}`,
      jobTitle: x.input || x.domain,
      company: x.company || x.domain,
      message: x.score >= 70 ? `SAFE - ${x.domain} - Score ${x.score}/100 - Domain ${x.ageDays} days old, SSL ${x.ssl ? 'OK' : 'Missing'}, Country ${x.country || 'Unknown'}.` : x.score >= 40 ? `CAUTION - ${x.domain} - Score ${x.score}/100 - ${x.reasons?.join(' • ') || x.label}. Dhyaan se check karo.` : `DANGER - ${x.domain} - Score ${x.score}/100 - ${x.reasons?.join(' • ') || x.label}. Paisa / Document MAT bhejo.`,
      severity: x.score >= 70 ? 'info' : x.score >= 40 ? 'warning' : 'danger',
      type: x.score >= 70 ? 'safe' : 'risk',
      timestamp: x.date || new Date().toLocaleString(),
      score: x.score || 0,
    }));
    setAlerts(realAlerts);
  }, []);

  const addWatch = async () => {
    const v = watchInput.trim();
    if (!v) { setError('Company / Domain daalo - jaise vercel.com'); return; }
    const domainMatch = v.match(/([a-z0-9-]+\.[a-z]{2,})/i);
    const domain = domainMatch ? domainMatch[1] : v;
    setError(''); setLoading(true);
    try {
      const res: any = await verifyCompanyReal(domain);
      const newWatch = [domain, ...watchList].slice(0, 20);
      setWatchList(newWatch);
      localStorage.setItem('watch_list', JSON.stringify(newWatch));
      const newAlert: AlertItem = {
        id: `watch-${Date.now()}`,
        jobTitle: v,
        company: res.company || res.domain,
        message: res.score >= 70 ? `WATCH ADDED - ${res.domain} SAFE - Score ${res.score}/100 - Ab ye list me monitor hoga.` : `WATCH ADDED - ${res.domain} - Score ${res.score}/100 - ${res.reasons?.join(' • ') || res.label}`,
        severity: res.score >= 70 ? 'info' : res.score >= 40 ? 'warning' : 'danger',
        type: 'watch',
        timestamp: new Date().toLocaleString(),
        score: res.score,
      };
      setAlerts([newAlert, ...alerts]);
      setWatchInput('');
    } catch { setError('Check fail - sahi domain daalo - jaise vercel.com'); }
    setLoading(false);
  };

  const recheckWatch = async (domain: string) => {
    setLoading(true);
    try {
      const res: any = await verifyCompanyReal(domain);
      const newAlert: AlertItem = {
        id: `recheck-${Date.now()}`,
        jobTitle: domain,
        company: res.company || res.domain,
        message: `RE-CHECKED LIVE - ${res.domain} - Score ${res.score}/100 - Age ${res.ageDays} days - SSL ${res.ssl ? 'OK' : 'Missing'} - Country ${res.country || 'Unknown'}`,
        severity: res.score >= 70 ? 'info' : res.score >= 40 ? 'warning' : 'danger',
        type: 'recheck',
        timestamp: new Date().toLocaleString(),
        score: res.score,
      };
      setAlerts([newAlert, ...alerts]);
    } catch {}
    setLoading(false);
  };

  const dismiss = (id: string) => setAlerts(alerts.filter(a => a.id !== id));
  const removeWatch = (d: string) => {
    const nw = watchList.filter(x => x !== d);
    setWatchList(nw);
    localStorage.setItem('watch_list', JSON.stringify(nw));
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Job Alerts & Monitoring - 100% REAL - LIVE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Global Job Monitoring</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Apni khud ki checked companies ko watch karo. Har Re-Check LIVE hoga - crt.sh + RDAP + DNS se. Koi nakli 50+ boards wala jhooth nahi.</p>
        </motion.div>

        {/* ADD WATCH - REAL */}
        <div className="glass-card rounded-2xl p-2 mb-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input value={watchInput} onChange={(e)=>{setWatchInput(e.target.value); setError('');}} onKeyDown={(e)=> e.key==='Enter' && addWatch()} placeholder="Watch karne ke liye Company / Domain - jaise vercel.com" className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 outline-none" />
            </div>
            <button onClick={addWatch} disabled={!watchInput.trim() || loading} className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {loading ? 'Checking...' : 'ADD TO WATCH'}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 text-center mb-4">{error}</p>}

        {/* Monitoring status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl ${watching ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-500/10 border-gray-500/20'} border flex items-center justify-center`}>
                  <Globe className={`w-6 h-6 ${watching ? 'text-emerald-400' : 'text-gray-500'}`} />
                </div>
                {watching && <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-xl border border-emerald-500/30" />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{watching ? 'Monitoring Active' : 'Monitoring Paused'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{watching ? `Tumhare ${watchList.length} watched + ${alerts.length} checks - Re-Check dabate hi LIVE check hoga` : 'Resume dabao'}</p>
              </div>
            </div>
            <button onClick={() => setWatching(!watching)} className={`px-4 py-2 rounded-lg text-sm font-semibold ${watching ? 'bg-white/[0.06] border border-white/10 text-gray-300' : 'bg-emerald-600 text-white'}`}>{watching ? 'Pause' : 'Resume'}</button>
          </div>
          {watching && watchList.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.04]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {watchList.map((d, i) => (
                  <motion.div key={d} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2 min-w-0"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" /><span className="text-xs text-gray-300 truncate">{d}</span></div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={()=>recheckWatch(d)} className="p-1 text-gray-500 hover:text-white"><RefreshCw className="w-3.5 h-3.5" /></button>
                      <button onClick={()=>removeWatch(d)} className="p-1 text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Watched jobs - REAL */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-amber-400" /> Watched Jobs ({watchList.length}) - Tumhare Added</h3>
          {watchList.length === 0 ? (
            <p className="text-sm text-gray-500">Abhi koi watched job nahi hai. Upar se koi Company / Domain add karo - jaise vercel.com - wo yaha aayegi, nakli list nahi.</p>
          ) : (
            <div className="space-y-2">
              {watchList.map((d) => (
                <div key={d} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div><p className="text-sm font-medium text-white">{d}</p><p className="text-xs text-gray-500">Live Re-Check Available</p></div>
                  <button onClick={()=>recheckWatch(d)} className="text-[11px] font-semibold px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1"><RefreshCw className="w-3 h-3" /> RE-CHECK LIVE</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts feed - REAL */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-amber-400" /> Recent Alerts - Tumhare Real Checks Se {alerts.length > 0 && <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold">{alerts.length}</span>}</h3>
            {alerts.length > 0 && <button onClick={() => setAlerts([])} className="text-xs text-gray-500 hover:text-white">Clear all</button>}
          </div>
          <AnimatePresence>
            <div className="space-y-3">
              {alerts.map((alert, i) => {
                const config = severityConfig[alert.severity];
                const StatusIcon = config.icon;
                return (
                  <motion.div key={alert.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100, height: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card rounded-xl p-4 border-l-2 ${alert.severity === 'danger' ? 'border-l-red-500' : alert.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}><StatusIcon className={`w-4 h-4 ${config.color}`} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-sm font-semibold text-white">{alert.jobTitle}</span><span className="text-xs text-gray-600">·</span><span className="text-xs text-gray-500">{alert.company} • Score {alert.score}/100</span></div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">{alert.message}</p>
                        <div className="flex items-center gap-3"><span className="text-[11px] text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.timestamp}</span><span className={`text-[10px] font-semibold flex items-center gap-1 ${config.color}`}><StatusIcon className="w-3 h-3" /> {alert.severity}</span></div>
                      </div>
                      <button onClick={() => dismiss(alert.id)} className="text-gray-600 hover:text-white p-1"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                );
              })}
              {alerts.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl p-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">All caught up - No Fake Alerts</p>
                  <p className="text-xs text-gray-500 mt-1">Abhi tumne koi check nahi kiya hai. Pehle koi Company check karo, uska real alert yaha aayega.</p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
          <p className="text-[11px] text-gray-600 mt-4 text-center">100% Real - Alerts sirf tumhare khud ke checks se bante hai. Source: crt.sh + RDAP + DNS. Koi 50+ boards ka jhootha दावा nahi - Professional tareeka yehi hai.</p>
        </div>
      </div>
    </div>
  );
}
