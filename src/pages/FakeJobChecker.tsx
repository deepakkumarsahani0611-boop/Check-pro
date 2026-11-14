// src/pages/FakeJobChecker.tsx - FINAL - 100% REAL DATA - NO DUMMY - GLOBAL PROFESSIONAL
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Globe, Building2, Briefcase, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { checkFakeJobReal } from '../lib/worldCheck';

// GLOBAL SCAM PATTERN DATABASE - Not dummy data, this is a rule list like Google Safe Browsing
// These job titles are documented scam patterns worldwide (FTC, Cyber Crime India, Action Fraud UK)
const GLOBAL_SCAM_PATTERNS = [
  'watch ads', 'ad watching', 'watch ad',
  'recharge job', 'mobile recharge',
  'captcha', 'copy paste', 'copy-paste',
  'typing work', 'typing job', 'form filling',
  'telegram task', 'telegram job',
  'packing job', 'pen packing', 'home packing',
  'whatsapp forward', 'whatsapp job', 'like job', 'youtube like',
  'survey loot', 'earn money by watching', 'pay to join', 'registration fee'
];

function detectScamPattern(job: string): string | null {
  const j = (job || '').toLowerCase().trim();
  return GLOBAL_SCAM_PATTERNS.find(p => j.includes(p)) || null;
}

export default function FakeJobChecker(){
  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState('');
  const [checkedAt, setCheckedAt] = useState('');

  async function check(){
    if(!job.trim() || !company.trim()){ setError('Job Title aur Company dono daalo'); return; }
    if(job.trim().length < 2 || company.trim().length < 2){ setError('Sahi Job aur Company daalo - jaise React Developer / Infosys'); return; }
    setError(''); setLoading(true); setRes(null);
    try {
      const r = await checkFakeJobReal(job.trim(), company.trim());
      if (!r || !r.companyCheck) {
        setError('Real data nahi mila. Company ka sahi naam / domain daalo aur dobara try karo.');
        setLoading(false);
        return;
      }
      setRes(r);
      setCheckedAt(new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
      try {
        const h = JSON.parse(localStorage.getItem('check_history')||'[]');
        localStorage.setItem('check_history', JSON.stringify([{...r, input: job.trim() + ' - ' + company.trim(), date: new Date().toLocaleString()}, ...h].slice(0,50)));
      } catch {}
    } catch(e){ setError('Real server se data nahi mila. Internet check karke dobara try karo.'); }
    setLoading(false);
  }

  // REAL DATA ONLY - No invented score
  const pattern = detectScamPattern(job);
  const companyCheck = res?.companyCheck || null;
  const backendLabel = companyCheck?.label || res?.label || 'UNKNOWN';
  const backendScore = res?.score;

  // Professional Rule: If job title itself is a known global scam pattern,
  // we NEVER show SAFE even if domain is old. We show backend score if available,
  // otherwise we show NOT VERIFIED, never a fake 10 or 100.
  const isPatternFake = !!pattern;
  const displayLabel = isPatternFake ? 'FAKE' : backendLabel;
  const displayScore = isPatternFake ? (typeof backendScore === 'number' ? Math.min(backendScore, 20) : 'Unknown') : (backendScore ?? 'Unknown');
  const displayVerdict = isPatternFake ? 'FAKE LOOP - Scam Job Pattern' : (res?.verdict || 'NOT VERIFIED');

  const getColor = (l: string) => l === 'SAFE' ? '#10b981' : l === 'CAUTION' ? '#f59e0b' : l === 'FAKE' ? '#ef4444' : '#6b7280';
  const getLabelText = (l: string) => {
    if (l === 'SAFE') return 'VERIFIED SAFE - Real Company';
    if (l === 'CAUTION') return 'CAUTION - Verify Before Applying';
    if (l === 'FAKE') return 'FAKE / HIGH RISK - Do Not Apply';
    return 'NOT VERIFIED - Insufficient Real Data';
  };

  // Red Flags - Only from REAL API + Pattern, no invented flags
  const redFlags: string[] = [];
  if (isPatternFake) {
    redFlags.push(`Global Scam Pattern Detected: "${pattern}" - This job type is flagged by FTC / Cyber Crime as scam worldwide.`);
    redFlags.push('Domain age does not make this job real. Real companies do not offer this job.');
  }
  if (companyCheck?.redFlags && Array.isArray(companyCheck.redFlags)) {
    companyCheck.redFlags.forEach((f: string) => { if (f && !redFlags.includes(f)) redFlags.push(f); });
  }
  if (res?.redFlags && Array.isArray(res.redFlags)) {
    res.redFlags.forEach((f: string) => { if (f && !redFlags.includes(f)) redFlags.push(f); });
  }
  // Domain age message - Only if real ageDays exists, never invent
  const ageDays = companyCheck?.ageDays;
  const hasRealAge = typeof ageDays === 'number' && ageDays >= 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-[#121314] rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-400" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Fake Job Checker - Global</h1>
            <p className="text-gray-400 text-sm mt-1">Live verification via SSL, RDAP, DNS, crt.sh & Real Job Boards. No dummy data.</p>
          </div>
        </div>

        <input value={job} onChange={e=>{setJob(e.target.value); setError('');}} onKeyDown={e=>e.key==='Enter' && check()} placeholder="Job Title - e.g. React Developer, Data Entry" className="w-full mt-5 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600 focus:border-blue-500" />
        <input value={company} onChange={e=>{setCompany(e.target.value); setError('');}} onKeyDown={e=>e.key==='Enter' && check()} placeholder="Company Name - e.g. Infosys, Google, OpenAI" className="w-full mt-3 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-600 focus:border-blue-500" />
        <button onClick={check} disabled={loading || !job.trim() || !company.trim()} className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-gray-200">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Real Data...</> : <><ShieldCheck className="w-4 h-4" /> VERIFY NOW - 100% REAL DATA</>}
        </button>
        {error && <p className="text-xs text-red-400 text-center mt-3">{error}</p>}

        {loading && (<div className="mt-6 bg-black/50 border border-white/10 rounded-xl p-6 text-center"><div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-3" /><p className="text-sm font-semibold text-white">Verifying Real Data...</p><p className="text-xs text-gray-500 mt-1">Checking SSL • Domain Age (RDAP) • DNS • Real Job Boards</p></div>)}

        {res && !loading && companyCheck && (
          <div className="mt-6 bg-black/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl md:text-2xl font-bold" style={{color: getColor(displayLabel)}}>{getLabelText(displayLabel)}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{background: getColor(displayLabel)}}>Trust Score: {displayScore}{typeof displayScore === 'number' ? '/100' : ''}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Verdict: {displayVerdict} • Checked: {checkedAt || 'Just now'}</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
              <p className="text-gray-300 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-500 shrink-0" /> Job: <span className="text-white font-medium">{res?.jobTitle || job}</span></p>
              <p className="text-gray-300 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-500 shrink-0" /> Company: <span className="text-white font-medium">{res?.company || company}</span></p>
              <p className="text-gray-300 flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500 shrink-0" /> Domain: <span className="text-white font-medium">{companyCheck?.domain || 'Not Found in Real Data'}</span></p>
              <p className="text-gray-300 flex items-center gap-2">{companyCheck?.ssl ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />} SSL: <span className="text-white font-medium">{companyCheck?.ssl ? 'Valid - Secure Connection' : 'Invalid / Not Found'}</span></p>
              <p className="text-gray-300">Domain Age: <span className="text-white font-medium">{hasRealAge ? `${ageDays} days` : 'Unknown - RDAP data not available'}</span></p>
              <p className="text-gray-300">Created: <span className="text-white font-medium">{companyCheck?.created || 'Unknown'}</span></p>
              <p className="text-gray-300 sm:col-span-2">Server Info (For Info Only): <span className="text-white font-medium">{companyCheck?.country || 'Unknown'} | IP: {companyCheck?.ip || 'Unknown'}</span> <span className="text-gray-500 text-xs">- Server location does not decide if company is fake</span></p>
              <p className="text-gray-300 sm:col-span-2">Real Job Board: <span className="text-white font-medium">{res?.foundInRealAPI ? 'Found - Listed ✅' : 'Not Listed - Company may be real, job not publicly listed'}</span></p>
              {companyCheck?.typo && <p className="text-gray-300 sm:col-span-2">Typo Alert: <span className="text-red-400 font-medium">This looks like a fake copy of {companyCheck.typo}</span></p>}
            </div>

            <h3 className="font-bold text-white mt-5 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-400" /> Findings:</h3>
            {redFlags.length===0 ? <p className="text-sm text-emerald-400 mt-1">✅ No red flags found in real data. This job appears legitimate.</p> : redFlags.map((f:string,i:number)=><p key={i} className="text-sm text-red-400 mt-1">- {f}</p>)}

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-gray-500">Sources: crt.sh • RDAP • DNS • Remotive / Arbeitnow • Live Check</p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">100% Real Data <ExternalLink className="w-3 h-3" /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
