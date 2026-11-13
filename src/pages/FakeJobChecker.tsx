// src/pages/FakeJobChecker.tsx - FINAL - LABEL BASED - LOCKED - 100%
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Globe, Building2, Briefcase, CheckCircle2 } from 'lucide-react';
import { checkFakeJobReal } from '../lib/worldCheck';

export default function FakeJobChecker(){
  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState('');
  async function check(){
    if(!job.trim() || !company.trim()){ setError('Job Title aur Company dono daalo bhai'); return; }
    if(job.trim().length < 2 || company.trim().length < 2){ setError('Sahi Job aur Company daalo - jaise Data Entry / Infosys'); return; }
    setError(''); setLoading(true); setRes(null);
    try {
      const r = await checkFakeJobReal(job.trim(), company.trim());
      setRes(r);
      const h = JSON.parse(localStorage.getItem('check_history')||'[]');
      localStorage.setItem('check_history', JSON.stringify([{...r, input: job.trim() + ' - ' + company.trim(), date: new Date().toLocaleString()}, ...h].slice(0,50)));
    } catch(e){ setError('Check fail ho gaya, dobara try karo'); }
    setLoading(false);
  }
  const getColor = (label: string) => label === 'SAFE' ? '#10b981' : label === 'CAUTION' ? '#f59e0b' : label === 'FAKE' ? '#ef4444' : '#6b7280';
  const getLabel = (label: string, typo: any) => {
    if (typo) return `FAKE - TYPO-SQUAT of ${typo}`;
    if (label === 'SAFE') return 'SAFE - Real Company';
    if (label === 'CAUTION') return 'CAUTION - Check Carefully';
    if (label === 'FAKE') return 'FAKE / HIGH RISK';
    return 'UNKNOWN - Insufficient Data';
  };
  const label = res?.companyCheck?.label || res?.label || 'UNKNOWN';
  const typo = res?.companyCheck?.typo || null;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-[#121314] rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-400" /></div>
          <div><h1 className="text-2xl md:text-3xl font-bold text-white">Fake Job Checker - Global</h1><p className="text-gray-400 text-sm mt-1">Koi bhi company / job ka naam dalo - USA, India, UK, Dubai, kahi ka bhi - Live 100% Real check hoga.</p></div>
        </div>
        <input value={job} onChange={e=>{setJob(e.target.value); setError('');}} onKeyDown={e=>e.key==='Enter' && check()} placeholder="Job Title - e.g. Data Entry, React Developer" className="w-full mt-5 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600" />
        <input value={company} onChange={e=>{setCompany(e.target.value); setError('');}} onKeyDown={e=>e.key==='Enter' && check()} placeholder="Company Name - e.g. Infosys, Google, XYZ Pvt Ltd" className="w-full mt-3 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600" />
        <button onClick={check} disabled={loading || !job.trim() || !company.trim()} className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking Real Data...</> : <><ShieldCheck className="w-4 h-4" /> CHECK NOW - 100% REAL</>}
        </button>
        {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}
        {loading && (<div className="mt-6 bg-black/50 border border-white/10 rounded-xl p-6 text-center"><div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-3" /><p className="text-sm font-semibold text-white">Real Check Chal Raha Hai...</p><p className="text-xs text-gray-500 mt-1">Checking real SSL, real domain age, real job boards</p></div>)}
        {res && !loading && (
          <div className="mt-6 bg-black/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-2xl font-bold" style={{color: getColor(label)}}>{getLabel(label, typo)} - {res.verdict}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{background: getColor(label)}}>Trust Score: {res.score ?? 'Unknown'}/100</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
              <p className="text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-500" /> Job: <span className="text-white font-medium">{res.jobTitle}</span></p>
              <p className="text-gray-300 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-500" /> Company: <span className="text-white font-medium">{res.company}</span></p>
              <p className="text-gray-300 flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500" /> Domain: <span className="text-white font-medium">{res.companyCheck.domain}</span></p>
              <p className="text-gray-300 flex items-center gap-2">{res.companyCheck.ssl ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />} SSL: <span className="text-white font-medium">{res.companyCheck.ssl ? `Valid - ${res.companyCheck.sslIssuer || 'Unknown Issuer'}` : 'Invalid / Nahi Hai'}</span></p>
              <p className="text-gray-300">Domain Age: <span className="text-white font-medium">{res.companyCheck.ageDays !== null && res.companyCheck.ageDays !== undefined ? `${res.companyCheck.ageDays} din` : 'Unknown'}</span></p>
              <p className="text-gray-300">Created: <span className="text-white font-medium">{res.companyCheck.created || 'Unknown'}</span></p>
              <p className="text-gray-300 sm:col-span-2">Country / Server: <span className="text-white font-medium">{res.companyCheck.country || 'Unknown'} | IP: {res.companyCheck.ip || 'Unknown'}</span></p>
              <p className="text-gray-300 sm:col-span-2">Real Job Board me mili? <span className="text-white font-medium">{res.foundInRealAPI ? 'Haan - Mili ✅' : 'Nahi - Nahi Mili ❌'}</span></p>
              {typo && <p className="text-gray-300 sm:col-span-2">Typo Alert: <span className="text-red-400 font-medium">Ye {typo} ki nakli copy lag rahi hai</span></p>}
            </div>
            <h3 className="font-bold text-white mt-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-400" /> Red Flags:</h3>
            {res.redFlags.length===0 ? <p className="text-sm text-emerald-400 mt-1">✅ Koi Red Flag nahi hai - Ye job likely real hai.</p> : res.redFlags.map((f:string,i:number)=><p key={i} className="text-sm text-red-400 mt-1">- {f}</p>)}
            <p className="text-[11px] text-gray-600 mt-4">Source: crt.sh + RDAP + DNS + Remotive / Arbeitnow - 100% Real Data, No Dummy</p>
          </div>
        )}
      </div>
    </div>
  );
}
