import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, TrendingUp, Calendar, DollarSign, MapPin, RefreshCw, Edit3, Trash2, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { jobHistoryData } from '@/data/mockData';
import type { HistoryEvent } from '@/data/mockData';

const eventTypeConfig: Record<HistoryEvent['type'], { icon: typeof Plus; color: string; bg: string; border: string; label: string }> = {
  posted: { icon: Plus, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Posted' },
  reposted: { icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Reposted' },
  salary_changed: { icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Salary Changed' },
  location_changed: { icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Location Changed' },
  edited: { icon: Edit3, color: 'text-gray-400', bg: 'bg-white/[0.04]', border: 'border-white/10', label: 'Edited' },
  removed: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Removed' },
};

export default function JobHistory() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof jobHistoryData.safe | null>(null);

  const handleSearch = (type: 'safe' | 'caution' | 'danger') => {
    setLoading(true);
    setResult(null);
    setQuery(type === 'safe' ? 'Senior Frontend Engineer at Vercel' : type === 'caution' ? 'Data Entry at QuickHire' : 'Marketing Executive at Global Digital Corp');
    setTimeout(() => {
      setResult(jobHistoryData[type]);
      setLoading(false);
    }, 1500);
  };

  const isSuspicious = result && (result.repostCount > 2 || result.salaryChanges > 2);

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Job Listing History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Detect the Fake Loop
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            See when a job was posted, how many times it was re-posted, salary changes, and location shifts — all on a timeline to expose fake patterns.
          </p>
        </motion.div>

        {/* Quick picks */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {([
            { type: 'safe' as const, label: 'Clean Job (Vercel)' },
            { type: 'caution' as const, label: 'Suspicious (QuickHire)' },
            { type: 'danger' as const, label: 'Fake Loop (Global Digital)' },
          ]).map((item) => (
            <button
              key={item.type}
              onClick={() => handleSearch(item.type)}
              className="text-xs font-medium text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.02] transition-all"
            >
              {item.label}
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
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Scanning job boards for posting history and changes...</p>
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
            >
              {/* Stats */}
              <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-white">{result.jobTitle}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{result.company}</p>
                  </div>
                  {isSuspicious ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400">Suspicious Pattern</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Clean History</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Re-posts', value: result.repostCount, icon: RefreshCw, color: result.repostCount > 2 ? 'text-red-400' : 'text-gray-300' },
                    { label: 'Salary Changes', value: result.salaryChanges, icon: DollarSign, color: result.salaryChanges > 2 ? 'text-orange-400' : 'text-gray-300' },
                    { label: 'Location Changes', value: result.locationChanges, icon: MapPin, color: result.locationChanges > 1 ? 'text-purple-400' : 'text-gray-300' },
                    { label: 'First Posted', value: result.firstPosted.split('-').slice(1).join('/'), icon: Calendar, color: 'text-blue-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                      <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Posting Timeline
                </h3>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                  <div className="space-y-1">
                    {result.events.map((event, i) => {
                      const config = eventTypeConfig[event.type];
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-4 py-3"
                        >
                          <div className={`relative z-10 w-10 h-10 rounded-full ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                            <config.icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0 pb-3 border-b border-white/[0.03]">
                            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-semibold text-white">{event.label}</span>
                              <span className="text-xs text-gray-600 font-mono">{event.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{event.detail}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Warning */}
              {isSuspicious && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-5 rounded-2xl bg-red-500/5 border border-red-500/15 flex items-start gap-4"
                >
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-300 mb-1">Fake Loop Detected</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This job has been re-posted {result.repostCount} times with {result.salaryChanges} salary changes and {result.locationChanges} location changes.
                      Legitimate employers don't re-post the same job repeatedly with shifting details. This is a classic scam pattern designed to collect applicant data.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Search for a job to see its history</h3>
            <p className="text-sm text-gray-500">Pick an example above to see the timeline analysis</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
