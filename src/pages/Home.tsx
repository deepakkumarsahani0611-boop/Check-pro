 import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Link2, Loader2, ArrowRight, Briefcase, MapPin, DollarSign, Clock, Building2, TrendingUp, Sparkles, Bookmark, ExternalLink, FileText, BadgeCheck, Users, Zap, Globe } from 'lucide-react';
import RiskDial from '@/components/RiskDial';
import RiskCheck from '@/components/RiskCheck';
import RiskReportModal from '@/components/RiskReportModal';
import Testimonials from '@/components/Testimonials';
import GlobalTrustLogos from '@/components/GlobalTrustLogos';
import { checkLinkReal, searchJobsWorldwide } from '@/lib/worldCheck';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'safe' | 'caution' | 'danger' | null>(null);
  const [showSimilar, setShowSimilar] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [realData, setRealData] = useState<any>(null);
  const [realSimilar, setRealSimilar] = useState<any[]>([]);

  const handleVerify = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setShowSimilar(false);
    setRealData(null);
    try {
      const real: any = await checkLinkReal(url);
      const trustScore = real.score;
      const riskScore = 100 - trustScore;
      let type: 'safe' | 'caution' | 'danger' = 'danger';
      if (trustScore >= 75) type = 'safe';
      else if (trustScore >= 40) type = 'caution';
      setResult(type);

      setRealData({
        riskScore,
        trustScore,
        status: type,
        platform: real.domain,
        jobTitle: `${real.company} - Job Link Verification`,
        company: real.company,
        location: real.country,
        salary: 'Check on original listing',
        postedDate: real.created ? `Domain Created: ${real.created}` : 'Unknown',
        domain: real.domain,
        ssl: real.ssl,
        issuer: real.issuer,
        ip: real.ip,
        ageDays: real.ageDays,
        verdict: real.verdict,
        checks: [
          { id: '1', label: 'SSL Certificate', status: real.ssl ? 'pass' : 'fail', description: real.ssl ? `Valid - Issuer: ${real.issuer}` : 'SSL Valid Nahi Hai' },
          { id: '2', label: 'Domain Age', status: (real.ageDays || 0) > 1000 ? 'pass' : (real.ageDays || 0) > 180 ? 'warning' : 'fail', description: real.ageDays !== null ? `Domain ${real.ageDays} din purana hai, Created: ${real.created}` : 'Domain age pata nahi chali' },
          { id: '3', label: 'Server Location', status: real.country !== 'Unknown' ? 'pass' : 'warning', description: `IP: ${real.ip} - ${real.country}` },
          { id: '4', label: 'Overall Verdict', status: trustScore >= 75 ? 'pass' : trustScore >= 40 ? 'warning' : 'fail', description: real.verdict },
        ]
      });

      try {
        const jobs = await searchJobsWorldwide(real.company);
        setRealSimilar(jobs.slice(0, 3).map((j: any, i: number) => ({ id: i, title: j.title, company: j.company, location: j.location, salary: j.salary, platform: j.source, trustScore: trustScore, url: j.url })));
      } catch { setRealSimilar([]); }
    } catch {
      setResult('danger');
    }
    setLoading(false);
  };

  const data = realData;
  const getRiskColor = (score: number) => score < 30 ? '#10b981' : score < 60 ? '#f59e0b' : '#ef4444';
  const riskColor = data ? getRiskColor(data.riskScore) : '';

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-transparent rounded-full blur-[130px]" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-gradient-to-b from-emerald-500/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-gradient-to-b from-cyan-500/6 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08090A]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-gray-200">AI-powered job scam detection - 100% Real Check</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">Don't Apply.<br /><span className="gradient-accent">Verify.</span></h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">Paste any job link and get an instant risk score. We check real SSL, real domain age, real IP location - NO dummy data.</p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
              <div className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-emerald-400" /><span className="text-xs font-medium text-gray-400">Real SSL Check</span></div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400" /><span className="text-xs font-medium text-gray-400">Real Domain Age</span></div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /><span className="text-xs font-medium text-gray-400">Real IP Location</span></div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /><span className="text-xs font-medium text-gray-400">Real-time analysis</span></div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="max-w-2xl mx-auto">
            <div className="glass-card rounded-2xl p-2 glow-blue">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex items-center gap-3 flex-1 px-4 py-3"><Link2 className="w-5 h-5 text-gray-500 flex-shrink-0" /><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerify()} placeholder="Paste job link here..." className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 outline-none" /></div>
                <button onClick={handleVerify} disabled={!url.trim() || loading} className="shine-btn flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20">{loading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>) : (<><ShieldCheck className="w-4 h-4" /><span>Verify Now</span></>)}</button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-xs text-gray-600">Try Real:</p>
              {[{ label: 'A real job', link: 'https://google.com' }, { label: 'Suspicious job', link: 'https://example.com' }, { label: 'Check any job', link: 'https://linkedin.com' }].map((t) => (<button key={t.label} onClick={() => { setUrl(t.link); }} className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded border border-white/5 hover:border-white/10">{t.label}</button>))}
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {loading && (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6 pb-32"><div className="glass-card rounded-2xl p-12 text-center"><div className="flex flex-col items-center gap-4"><div className="relative"><div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" /><ShieldCheck className="w-6 h-6 text-blue-400 absolute inset-0 m-auto" /></div><div><p className="text-sm font-semibold text-white mb-1">Real Check Chal Raha Hai...</p><p className="text-xs text-gray-500">Checking real SSL, real domain age, real IP location</p></div></div></div></motion.div>)}
        {data && !loading && (
          <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto px-6 pb-32">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-white/[0.06] flex flex-col lg:flex-row items-center gap-8" style={{ background: `linear-gradient(135deg, ${riskColor}08 0%, transparent 100%)` }}>
                <RiskDial score={data.riskScore} />
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2"><span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ color: riskColor, background: `${riskColor}15` }}>{data.status === 'safe' ? 'Verified Safe - REAL' : data.status === 'caution' ? 'Use Caution - REAL' : 'High Risk - REAL'}</span><span className="text-xs text-gray-500">via {data.platform}</span></div>
                  <h3 className="text-2xl font-bold text-white mb-2">{data.jobTitle}</h3>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-400"><span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {data.company}</span><span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {data.location}</span><span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {data.salary}</span><span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {data.postedDate}</span></div>
                  <p className="text-xs text-gray-500 mt-2">Trust Score: {data.trustScore}/100 | Verdict: {data.verdict} | SSL: {data.ssl ? 'Valid' : 'Invalid'} | IP: {data.ip}</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-5">
                    <button onClick={() => onNavigate('history')} className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"><Bookmark className="w-4 h-4" /> Save to Tracker</button>
                    <button onClick={() => onNavigate('history')} className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"><TrendingUp className="w-4 h-4" /> View History</button>
                    <button onClick={() => onNavigate('alerts')} className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-lg text-sm font-medium text-white transition-all">Watch This Job</button>
                    <button onClick={() => setShowReport(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white transition-all"><FileText className="w-4 h-4" /> View Full Report</button>
                  </div>
                </div>
              </div>
              <div className="p-8"><h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-400" /> Verification Checks - 100% Real Data</h4><div className="grid md:grid-cols-2 gap-3">{data.checks.map((check: any) => (<RiskCheck key={check.id} check={check} />))}</div></div>
            </div>
            <div className="mt-8">
              <button onClick={() => setShowSimilar(!showSimilar)} className="w-full flex items-center justify-between p-4 glass-card glass-card-hover rounded-xl"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Briefcase className="w-5 h-5 text-emerald-400" /></div><div className="text-left"><p className="text-sm font-semibold text-white">{realSimilar.length} Real Similar Jobs Found</p><p className="text-xs text-gray-500">Real jobs from Remotive / Arbeitnow API</p></div></div><ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${showSimilar ? 'rotate-90' : ''}`} /></button>
              <AnimatePresence>{showSimilar && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="grid md:grid-cols-3 gap-4 mt-4">{realSimilar.map((job: any, i: number) => (<motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card glass-card-hover rounded-xl p-5"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-emerald-400" /></div><span className="text-xs font-semibold text-emerald-400">{job.trustScore}% Trust</span></div><span className="text-[10px] text-gray-600 px-2 py-0.5 rounded bg-white/[0.03]">{job.platform}</span></div><h4 className="text-sm font-semibold text-white mb-1">{job.title}</h4><p className="text-xs text-gray-500 mb-3">{job.company} · {job.location}</p><div className="flex items-center justify-between pt-3 border-t border-white/[0.04]"><span className="text-xs text-gray-400">{job.salary}</span><button onClick={() => onNavigate('history')} className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Apply <ExternalLink className="w-3 h-3" /></button></div></motion.div>))}</div></motion.div>)}</AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!data && !loading && <GlobalTrustLogos />}
      {!data && !loading && (
        <section className="relative max-w-7xl mx-auto px-6 pb-24"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: 'Fake Job Checker', desc: '5-point verification: domain age, official email, salary trap, duplicate, messaging flags', page: 'fake', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { icon: Building2, title: 'Company Verification', desc: 'Search any company — website, domain age, GST status, employee count, trust badge', page: 'company', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { icon: TrendingUp, title: 'Job Listing History', desc: 'Timeline of reposts, salary changes, location shifts — spot the fake loop pattern', page: 'history', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { icon: Sparkles, title: 'Global Job Monitoring', desc: 'Watch any job. We monitor 50+ boards and alert you on salary or repost changes', page: 'alerts', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { icon: Briefcase, title: 'Application Tracker', desc: 'Kanban board: Saved, Applied, Interview, Offer, Rejected — save any verified job', page: 'history', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
            { icon: ShieldCheck, title: 'Premium Plans', desc: 'Free: 5 checks. Pro: 500 checks + AI report + PDF export. Enterprise: API + global monitoring', page: 'pricing', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
          ].map((f, i) => (
            <motion.button key={f.title} onClick={() => onNavigate(f.page)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card glass-card-hover rounded-xl p-6 text-left group"><div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}><f.icon className={`w-5 h-5 ${f.color}`} /></div><h3 className="text-base font-semibold text-white mb-2">{f.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p><div className="flex items-center gap-1 mt-4 text-xs font-medium text-blue-400">Explore <ArrowRight className="w-3 h-3" /></div></motion.button>
          ))}
        </div></section>
      )}
      {!data && !loading && <Testimonials />}
      {showReport && data && <RiskReportModal data={data} onClose={() => setShowReport(false)} />}
    </div>
  );
                                                                                                                                                                                                                                                                                   }
