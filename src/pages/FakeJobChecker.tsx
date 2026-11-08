import { useState } from 'react';
import { checkFakeJobReal } from '../lib/worldCheck';

export default function FakeJobChecker(){
  const [job, setJob] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<any>(null);

  async function check(){
    if(!job.trim() || !company.trim()) return alert('Job aur Company dono daalo - tabhi 100% Real check hoga');
    setLoading(true);
    setRes(null);
    try {
      const r = await checkFakeJobReal(job.trim(), company.trim());
      setRes(r);
      const h = JSON.parse(localStorage.getItem('check_history')||'[]');
      localStorage.setItem('check_history', JSON.stringify([{...r, input: job.trim() + ' - ' + company.trim(), date: new Date().toLocaleString()}, ...h].slice(0,50)));
    } catch(e){ alert('Check fail hua, dobara try karo'); }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-[#121314] rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold">🛡️ Fake Job Checker - Global</h1>
        <p className="text-gray-400 text-sm mt-2">Koi bhi company / job ka naam dalo - USA, India, UK, Dubai, kahi ka bhi - Live 100% Real check hoga.</p>
        
        <input value={job} onChange={e=>setJob(e.target.value)} placeholder="Job Title - e.g. Data Entry, React Developer" className="w-full mt-4 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white" />
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company Name - e.g. Infosys, Google, XYZ Pvt Ltd" className="w-full mt-3 bg-black border border-white/20 rounded-xl px-4 py-3 outline-none text-white" />

        <button onClick={check} disabled={loading} className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'Checking Real Data...' : 'CHECK NOW - 100% REAL'}
        </button>

        {res && (
          <div className="mt-6 bg-black/50 border border-white/10 rounded-xl p-4">
            <h2 className={`text-2xl font-bold ${res.verdict.includes('FAKE') ? 'text-red-500' : res.verdict.includes('SUSPICIOUS') ? 'text-orange-400' : 'text-green-400'}`}>{res.verdict}</h2>
            <p className="text-sm text-gray-300 mt-2">Job: {res.jobTitle} | Company: {res.company}</p>
            <p className="text-sm text-gray-300">Domain: {res.companyCheck.domain} | SSL: {res.companyCheck.ssl ? 'Yes - Valid' : 'No - Invalid'}</p>
            <p className="text-sm text-gray-300">Domain Age: {res.companyCheck.ageDays} din | Created: {res.companyCheck.created}</p>
            <p className="text-sm text-gray-300">Country: {res.companyCheck.country}</p>
            <p className="text-sm text-gray-300">Real Job Board me mili? {res.foundInRealAPI ? 'Haan - Mili' : 'Nahi - Nahi Mili'}</p>
            <p className="text-sm text-gray-300">Score: {res.score}/100</p>
            <h3 className="font-bold mt-3">Red Flags:</h3>
            {res.redFlags.length===0 ? <p className="text-sm text-gray-400">Koi Red Flag nahi hai.</p> : res.redFlags.map((f:string,i:number)=><p key={i} className="text-sm text-red-400">- {f}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}
