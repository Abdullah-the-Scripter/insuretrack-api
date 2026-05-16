import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <Loader text="Loading dashboard metrics..." />;

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const officerInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">System Overview</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">Real-time processing metrics and officer performance</p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Claims', value: stats.total, sub: 'All time records', subColor: 'text-slate-400' },
          { label: 'Under Review', value: stats.under_review, dot: '#f59e0b', sub: 'Active caseload', subColor: 'text-amber-400' },
          { label: 'Approved', value: stats.approved, dot: '#10b981', sub: `${approvalRate}% success rate`, subColor: 'text-emerald-400' },
          { label: 'Rejected', value: stats.rejected, dot: '#ef4444', sub: 'Declined claims', subColor: 'text-red-400' },
        ].map(({ label, value, dot, sub, subColor }) => (
          <motion.div variants={itemVariants} key={label}>
            <Card hoverable className="h-full">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                {dot && <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_8px_currentColor]" style={{ background: dot, color: dot }} />}
                {label}
              </div>
              <div className="text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-md">{value ?? 0}</div>
              <div className={`text-xs font-semibold ${subColor}`}>{sub}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card delay={0.2} className="!p-0 overflow-hidden mt-6 border-white/10">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="text-sm font-bold text-white tracking-wide">Officer Performance Report</div>
          <div className="text-xs text-slate-400 mt-0.5 font-medium">Claims handled per assigned officer</div>
        </div>

        {!stats.officerStats || stats.officerStats.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm font-medium text-slate-500">
            No officers have been assigned claims yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-black/20 border-b border-white/10 text-slate-400">
                  {['Officer', 'Active', 'Approved', 'Rejected', 'Settled', 'Total', 'Approval Rate'].map((h) => (
                    <th key={h} className="px-6 py-4 font-bold uppercase tracking-wider text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {stats.officerStats.map((officer, i) => {
                  const rate = officer.totalProcessed > 0 ? Math.round((officer.approved / officer.totalProcessed) * 100) : 0;
                  const colors = ['bg-blue-500/20 text-blue-300 border-blue-500/30', 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', 'bg-amber-500/20 text-amber-300 border-amber-500/30', 'bg-purple-500/20 text-purple-300 border-purple-500/30'];
                  const avatarClass = colors[i % colors.length];
                  
                  return (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 border ${avatarClass}`}>
                            {officerInitials(officer.officerName)}
                          </div>
                          <span className="font-bold text-white">{officer.officerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                          {officer.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-bold">{officer.approved}</td>
                      <td className="px-6 py-4 text-red-400 font-bold">{officer.rejected}</td>
                      <td className="px-6 py-4 text-slate-300 font-bold">{officer.settled}</td>
                      <td className="px-6 py-4 font-black text-white text-lg">{officer.totalProcessed}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-black/40 rounded-full min-w-[80px] overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${rate}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-8">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;