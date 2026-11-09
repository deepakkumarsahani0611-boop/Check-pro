// src/components/RiskReportModal.tsx - 100% REAL, NO MOCKDATA
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, ShieldAlert, ShieldX, Flag, CheckCircle2, XCircle,
  AlertTriangle, Globe, Copy, TrendingUp, FileText, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

// REAL type - worldCheck.ts se aane wala real data
export type RealCheck = { id: string; label: string; detail: string; status: 'pass' | 'fail' | 'warning'; icon?: string };
export type RealResult = {
  domain: string; score: number; label: string;
  domainAgeDays: number | null; sslValid: boolean; hasMx: boolean; hasWww: boolean;
  checks: RealCheck[];
};

function getRiskColor(score: number) {
  if (score >= 70) return '#10B981';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}
function getRiskLabel(score: number) {
  if (score >= 70) return 'Verified Safe';
  if (score >= 40) return 'Use Caution';
  return 'High Risk — Likely Scam';
}

const statusConfig = {
  pass: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
  fail: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
};

function CheckRow({ check }: { check: RealCheck }) {
  const config = statusConfig[check.status];
  const StatusIcon = config.icon;
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.border} ${config.bg}`}>
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
        <Globe className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[13px] font-semibold text-white">{check.label}</span>
          <StatusIcon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{check.detail}</p>
      </div>
    </div>
  );
}

export default function RiskReportModal({ open, onClose, data }: { open: boolean; onClose: () => void; data: RealResult }) {
  const [copied, setCopied] = useState(false);
  const riskColor = getRiskColor(data.score);
  const StatusIcon = data.score >= 70 ? ShieldCheck : data.score >= 40 ? ShieldAlert : ShieldX;
  const redFlags = data.checks.filter((c) => c.status === 'fail' || c.status === 'warning');
  const passedChecks = data.checks.filter((c) => c.status === 'pass');

  const r = 55;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  const copyReport = async () => {
    const text = `JobCheck.pro Report\nDomain: ${data.domain}\nScore: ${data.score}/100 - ${getRiskLabel(data.score)}\nDomain Age: ${data.domainAgeDays ?? 'Unknown'} days\nSSL: ${data.sslValid ? 'Valid' : 'Not found'}\nMX: ${data.hasMx ? 'Yes' : 'No'}\nChecks:\n${data.checks.map(c => `- ${c.label}: ${c.detail} [${c.status}]`).join('\n')}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0B0D0F] border border-white/10 shadow-2xl" style={{ boxShadow: `0 0 60px ${riskColor}15` }}>
            <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06] overflow-hidden" style={{ background: `linear-gradient(135deg, ${riskColor}12 0%, transparent 70%)` }}>
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"><X className="w-4 h-4" /></button>
              <div className="relative flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-[150px] h-[150px] flex-shrink-0">
                  <svg width="150" height="150" className="-rotate-90">
                    <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle cx="75" cy="75" r={r} fill="none" stroke={riskColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ filter: `drop-shadow(0 0 6px ${riskColor}50)` }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <StatusIcon className="w-6 h-6 mb-0.5" style={{ color: riskColor }} />
                    <span className="text-3xl font-bold" style={{ color: riskColor }}>{data.score}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider">Trust Score</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: riskColor, background: `${riskColor}15` }}>{getRiskLabel(data.score)}</span>
                  <h2 className="text-xl font-bold text-white mb-2 break-all">{data.domain}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-gray-400">
                    <span>Domain Age: {data.domainAgeDays != null ? `${Math.floor(data.domainAgeDays / 365)}y ${Math.floor((data.domainAgeDays % 365) / 30)}m` : 'Unknown'}</span>
                    <span>SSL: {data.sslValid ? 'Valid' : 'Not Found'}</span>
                    <span>MX: {data.hasMx ? 'Yes' : 'No'}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Source: crt.sh + RDAP + DNS — Live check, no mock data</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              {redFlags.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2"><Flag className="w-4 h-4" />{redFlags.length} Red Flag{redFlags.length > 1 ? 's' : ''} Detected</h3>
                  <ul className="space-y-2">{redFlags.map((flag) => (
                    <li key={flag.id} className="flex items-start gap-2.5"><span className={`w-1.5 h-1.5 rounded-full ${flag.status === 'fail' ? 'bg-red-400' : 'bg-amber-400'} mt-2 flex-shrink-0`} /><div><p className="text-[13px] font-semibold text-white">{flag.label}</p><p className="text-xs text-gray-500">{flag.detail}</p></div></li>
                  ))}</ul>
                </div>
              )}
              {passedChecks.length > 0 && (
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5">
                  <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{passedChecks.length} Check{passedChecks.length > 1 ? 's' : ''} Passed</h3>
                  <div className="flex flex-wrap gap-2">{passedChecks.map((c) => (<span key={c.id} className="text-xs text-gray-400 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400" />{c.label}</span>))}</div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" />Detailed Verification Report</h3>
                <div className="grid sm:grid-cols-2 gap-3">{data.checks.map((check) => (<CheckRow key={check.id} check={check} />))}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" />Our Recommendation</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {data.score >= 70 && "This domain passed critical checks (age, SSL, DNS). You can proceed — but always verify the official email domain before sharing personal info."}
                  {data.score >= 40 && data.score < 70 && "This domain shows warning signs. Do not pay upfront fees or share sensitive documents. Contact the company via official website."}
                  {data.score < 40 && "This domain matches high-risk patterns (very new / no SSL / no MX). Do NOT share personal or banking details."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={copyReport} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-sm font-semibold text-white transition-all"><Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy Real Report'}</button>
                <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-sm font-semibold text-black transition-all"><ShieldCheck className="w-4 h-4" />Close Report</button>
                <a href={`https://crt.sh/?q=${encodeURIComponent(data.domain)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-white/20 text-sm font-medium text-gray-400 hover:text-white transition-all">Verify on crt.sh <ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
              <p className="text-[11px] text-gray-600 text-center">Data from live APIs. No fake number, no fake link.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
