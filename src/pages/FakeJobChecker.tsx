import { useState } from 'react';
import { globalCheck } from '../global/globalCheck';

export default function FakeJobChecker(){
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [res,setRes]=useState<any>(null);

  async function check(){
    if(!input.trim()) return alert('Company / Job ka naam dalo');
    setLoading(true);
    const r = await globalCheck(input.trim());
    setRes(r);
    const h = JSON.parse(localStorage.getItem('check_history')||'[]');
    localStorage.setItem('check_history', JSON.stringify([{...r, input: input.trim(), date: new Date().toLocaleString()}, ...h].slice(0,50)));
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-[#121314] rounded-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold">🛡️ Fake Job Checker - Global</h1>
        <p className="text-gray-400 text-sm mt-2">Koi bhi company / job ka naam dalo - USA, India, UK, Dubai, kahi ka bhi - Live check hoga.</p>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. google.com / info@company.com / Sharma Enterprises" className="w-full mt-5 p-3 rounded-xl bg-black/40 border border-white/10 outline-none" />
        <button onClick={check} disabled={loading} className="w-full mt-3 p-3 rounded-xl bg-emerald-500 text-black font-bold">
          {loading ? '⏳ 7 Live Global Sources Check ho raha hai...' : '🔍 CHECK NOW'}
        </button>
        {res && (
          <div className="mt-5 border-t border-dashed border-white/10 pt-4">
            <div className="text-5xl font-black text-center">{res.score}/100</div>
            <div className={`text-center font-bold p-2 rounded-full mt-2 ${res.score>=75?'bg-emerald-500/20 text-emerald-300':res.score>=45?'bg-yellow-500/20 text-yellow-300':'bg-red-500/20 text-red-300'}`}>{res.label}</div>
            <p className="mt-3"><b>{res.company}</b> • Domain: {res.domain} • Country: {res.country}</p>
            {res.reasons.map((r:string)=><p key={r}>• {r}</p>)}
            {res.details.map((d:string)=><p key={d} className="text-sm text-gray-300 border-t border-dashed border-white/10 py-2">{d}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}
