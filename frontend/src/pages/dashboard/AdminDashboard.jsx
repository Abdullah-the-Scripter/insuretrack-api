import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClaims: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  });

  const [officerStats, setOfficerStats] = useState([]);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await axiosInstance.get('/claims');
        
        // Safely extract the array exactly how your backend formats it
        const claimsArray = response.data.data || [];

        // --- TOP METRICS CALCULATION ---
        // Notice we are checking for 'pending' now!
        const total = claimsArray.length;
        const underReviewCount = claimsArray.filter(c => c.status === 'pending' || c.status === 'under review').length;
        const approvedCount = claimsArray.filter(c => c.status === 'approved').length;
        const rejectedCount = claimsArray.filter(c => c.status === 'rejected').length;

        setStats({
          totalClaims: total,
          underReview: underReviewCount,
          approved: approvedCount,
          rejected: rejectedCount
        });

        // --- OFFICER PERFORMANCE CALCULATION ---
        const officerMap = {};

        claimsArray.forEach(claim => {
          // Look at your JSON: we check if assignedOfficer exists and has a name
          if (claim.assignedOfficer && claim.assignedOfficer.name) {
            const officerName = claim.assignedOfficer.name;
            
            // If they aren't in the list yet, add them
            if (!officerMap[officerName]) {
              officerMap[officerName] = { 
                name: officerName, 
                totalAssigned: 0, 
                approved: 0, 
                pending: 0 
              };
            }
            
            // Tally up their stats based on the backend data
            officerMap[officerName].totalAssigned += 1;
            if (claim.status === 'approved') officerMap[officerName].approved += 1;
            if (claim.status === 'pending' || claim.status === 'under review') officerMap[officerName].pending += 1;
          }
        });

        setOfficerStats(Object.values(officerMap));

      } catch (error) {
        console.error("Failed to load metrics:", error);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto relative z-10">
      
      {/* 🔑 MAIN HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white transition-colors duration-300">
          System Overview
        </h1>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">
          Real-time processing metrics and officer performance
        </p>
      </div>

      {/* 📊 METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Claims</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{stats.totalClaims}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">All time records</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" /> Under Review
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{stats.underReview}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">Active caseload</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" /> Approved
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{stats.approved}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">Processed successfully</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" /> Rejected
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{stats.rejected}</span>
          </div>
          <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">Declined claims</p>
        </div>

      </div>

      {/* 📉 DYNAMIC PERFORMANCE REPORT SECTION */}
      <div className="relative rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
            Officer Performance Report
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Claims handled per assigned officer
          </p>
        </div>

        {officerStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-slate-300/50 dark:border-slate-800 bg-white/10 dark:bg-slate-950/20">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 text-center">
              No officers have been assigned claims yet.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {officerStats.map((officer, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/20 dark:border-white/5 backdrop-blur-md shadow-inner transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 text-sm">
                    {officer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{officer.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Cases: {officer.totalAssigned}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500/70 dark:text-emerald-400/70 mb-1">Approved</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{officer.approved}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-300 dark:bg-slate-700"></div>
                  <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-amber-500/70 dark:text-amber-400/70 mb-1">Pending</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{officer.pending}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;