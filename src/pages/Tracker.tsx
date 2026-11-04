import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Send, MessageSquare, Trophy, XCircle, Plus, X, MapPin, DollarSign, ShieldCheck, GripVertical } from 'lucide-react';
import { initialTrackedJobs } from '@/data/mockData';
import type { TrackedJob } from '@/data/mockData';

const columns = [
  { id: 'saved' as const, label: 'Saved', icon: Bookmark, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', count: 0 },
  { id: 'applied' as const, label: 'Applied', icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', count: 0 },
  { id: 'interview' as const, label: 'Interview', icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', count: 0 },
  { id: 'offer' as const, label: 'Offer', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', count: 0 },
  { id: 'rejected' as const, label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', count: 0 },
];

const logoColors = ['from-blue-500/20 to-blue-700/20', 'from-emerald-500/20 to-emerald-700/20', 'from-amber-500/20 to-amber-700/20', 'from-purple-500/20 to-purple-700/20', 'from-cyan-500/20 to-cyan-700/20', 'from-pink-500/20 to-pink-700/20'];

export default function Tracker() {
  const [jobs, setJobs] = useState<TrackedJob[]>(initialTrackedJobs);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '' });

  const handleDrop = (col: TrackedJob['status']) => {
    if (!draggedId) return;
    setJobs(jobs.map(j => j.id === draggedId ? { ...j, status: col, appliedDate: col === 'applied' && !j.appliedDate ? 'Today' : j.appliedDate } : j));
    setDraggedId(null);
    setDragOverCol(null);
  };

  const addJob = () => {
    if (!newJob.title.trim()) return;
    const job: TrackedJob = {
      id: `t${Date.now()}`,
      title: newJob.title,
      company: newJob.company || 'Unknown',
      location: newJob.location || '—',
      salary: newJob.salary || '—',
      trustScore: Math.floor(Math.random() * 40) + 60,
      status: 'saved',
      logo: newJob.company.charAt(0).toUpperCase() || '?',
    };
    setJobs([...jobs, job]);
    setNewJob({ title: '', company: '', location: '', salary: '' });
    setShowAdd(false);
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'applied' || j.status === 'interview' || j.status === 'offer').length,
    interviews: jobs.filter(j => j.status === 'interview').length,
    offers: jobs.filter(j => j.status === 'offer').length,
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-300">Application Tracker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
              Your Job Pipeline
            </h1>
            <p className="text-gray-400">Track every application from saved to offer. Drag cards between columns.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add Job
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Tracked', value: stats.total, color: 'text-white' },
            { label: 'In Progress', value: stats.applied, color: 'text-blue-400' },
            { label: 'Interviews', value: stats.interviews, color: 'text-amber-400' },
            { label: 'Offers', value: stats.offers, color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold"><span className={stat.color}>{stat.value}</span></p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((col) => {
            const colJobs = jobs.filter(j => j.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(col.id)}
                className={`rounded-2xl p-3 transition-all min-h-[400px] ${
                  dragOverCol === col.id ? 'bg-white/[0.04] border border-white/15' : 'glass-card'
                }`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${col.bg} border ${col.border} flex items-center justify-center`}>
                      <col.icon className={`w-3.5 h-3.5 ${col.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-white">{col.label}</span>
                  </div>
                  <span className="text-xs text-gray-600 px-2 py-0.5 rounded bg-white/[0.04]">{colJobs.length}</span>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {colJobs.map((job, i) => (
                      <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={() => setDraggedId(job.id)}
                        onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                        className={`group cursor-grab active:cursor-grabbing rounded-xl p-3 bg-white/[0.03] border border-white/[0.06] hover:border-white/12 transition-all ${
                          draggedId === job.id ? 'opacity-40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${logoColors[i % logoColors.length]} border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                            {job.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white leading-tight truncate">{job.title}</p>
                            <p className="text-[11px] text-gray-500 truncate">{job.company}</p>
                          </div>
                          <GripVertical className="w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                        </div>

                        <div className="flex items-center gap-2 mt-2.5 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/[0.04]">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className={`w-3.5 h-3.5 ${job.trustScore >= 70 ? 'text-emerald-400' : job.trustScore >= 40 ? 'text-amber-400' : 'text-red-400'}`} />
                            <span className={`text-[11px] font-semibold ${job.trustScore >= 70 ? 'text-emerald-400' : job.trustScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{job.trustScore}%</span>
                          </div>
                          {job.appliedDate && (
                            <span className="text-[10px] text-gray-600">{job.appliedDate}</span>
                          )}
                        </div>

                        {job.notes && (
                          <p className="text-[10px] text-gray-500 mt-2 px-2 py-1 rounded bg-white/[0.03] italic">{job.notes}</p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {colJobs.length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-700">
                      Drop jobs here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdd(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Add Job to Tracker</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'title', label: 'Job Title', placeholder: 'e.g. Senior Frontend Engineer' },
                  { key: 'company', label: 'Company', placeholder: 'e.g. Vercel Inc.' },
                  { key: 'location', label: 'Location', placeholder: 'e.g. Remote' },
                  { key: 'salary', label: 'Salary', placeholder: 'e.g. $140k-$180k' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">{field.label}</label>
                    <input
                      type="text"
                      value={(newJob as Record<string, string>)[field.key]}
                      onChange={(e) => setNewJob({ ...newJob, [field.key]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addJob()}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>
                ))}
                <button
                  onClick={addJob}
                  disabled={!newJob.title.trim()}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all mt-4"
                >
                  Add to Saved
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
