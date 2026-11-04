import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Globe, Eye, TrendingUp, DollarSign, RefreshCw, Trash2, Clock, AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react';
import { mockAlerts } from '@/data/mockData';
import type { JobAlert } from '@/data/mockData';

const severityConfig = {
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
  danger: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
};

const typeIcon: Record<JobAlert['type'], typeof DollarSign> = {
  salary_changed: DollarSign,
  reposted: RefreshCw,
  removed: Trash2,
  new_listing: TrendingUp,
  deadline: Clock,
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [watching, setWatching] = useState(true);

  const dismiss = (id: string) => setAlerts(alerts.filter(a => a.id !== id));

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Job Alerts & Monitoring</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Global Job Monitoring
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Watch any job and get instant alerts when salary changes, listings get re-posted, or new matching jobs appear across 50+ job boards.
          </p>
        </motion.div>

        {/* Monitoring status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl ${watching ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-500/10 border-gray-500/20'} border flex items-center justify-center`}>
                  <Globe className={`w-6 h-6 ${watching ? 'text-emerald-400' : 'text-gray-500'}`} />
                </div>
                {watching && (
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl border border-emerald-500/30"
                  />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {watching ? 'Global Monitoring Active' : 'Monitoring Paused'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {watching ? 'Checking 50+ job boards every 15 minutes' : 'Click resume to start monitoring'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setWatching(!watching)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                watching
                  ? 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-gray-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {watching ? 'Pause' : 'Resume'}
            </button>
          </div>

          {watching && (
            <div className="mt-6 pt-6 border-t border-white/[0.04]">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {['LinkedIn', 'Naukri', 'Indeed', 'Glassdoor', 'Monster', 'Facebook'].map((board, i) => (
                  <motion.div
                    key={board}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-gray-500">{board}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Watched jobs */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            Watched Jobs (3)
          </h3>
          <div className="space-y-2">
            {[
              { title: 'Data Entry Specialist', company: 'QuickHire Solutions', status: 'Flagged' },
              { title: 'Frontend Developer', company: 'TechStart Inc.', status: 'Monitoring' },
              { title: 'Senior Backend Engineer', company: 'Razorpay', status: 'Monitoring' },
            ].map((job) => (
              <div key={job.title} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                  job.status === 'Flagged' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Recent Alerts
              {alerts.length > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold">{alerts.length}</span>
              )}
            </h3>
            {alerts.length > 0 && (
              <button onClick={() => setAlerts([])} className="text-xs text-gray-500 hover:text-white transition-colors">
                Clear all
              </button>
            )}
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {alerts.map((alert, i) => {
                const config = severityConfig[alert.severity];
                const TypeIcon = typeIcon[alert.type];
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card glass-card-hover rounded-xl p-4 border-l-2 ${
                      alert.severity === 'danger' ? 'border-l-red-500' :
                      alert.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold text-white">{alert.jobTitle}</span>
                          <span className="text-xs text-gray-600">·</span>
                          <span className="text-xs text-gray-500">{alert.company}</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-2">{alert.message}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {alert.timestamp}
                          </span>
                          <span className={`text-[10px] font-semibold flex items-center gap-1 ${config.color}`}>
                            <StatusIcon className="w-3 h-3" /> {alert.severity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => dismiss(alert.id)}
                        className="text-gray-600 hover:text-white transition-colors p-1"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {alerts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-12 text-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white">All caught up</p>
                  <p className="text-xs text-gray-500 mt-1">No new alerts. We're monitoring 50+ boards for you.</p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
