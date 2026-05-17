import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClaims: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  });
  
  // 🚨 NEW: State to hold exactly what the server says
  const [debugLog, setDebugLog] = useState("Waiting for server response...");

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        // 🤔 Is it possible your backend expects '/admin/claims' for the full list?
        // If so, change this URL!
        const response = await axiosInstance.get('/claims');
        
        // Print the exact raw data to the screen
        setDebugLog(JSON.stringify(response.data, null, 2));

        let claimsArray = [];
        if (Array.isArray(response.data)) {
          claimsArray = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          claimsArray = response.data.data;
        } else if (response.data && Array.isArray(response.data.claims)) {
          claimsArray = response.data.claims;
        }

        const total = claimsArray.length;
        const underReviewCount = claimsArray.filter(c => c.status?.toLowerCase() === 'under review').length;
        const approvedCount = claimsArray.filter(c => c.status?.toLowerCase() === 'approved').length;
        const rejectedCount = claimsArray.filter(c => c.status?.toLowerCase() === 'rejected').length;

        setStats({
          totalClaims: total,
          underReview: underReviewCount,
          approved: approvedCount,
          rejected: rejectedCount
        });

      } catch (error) {
        // If the request crashes, print the exact error to the screen
        setDebugLog(`SERVER ERROR: ${error.message}\nStatus Code: ${error.response?.status}\nDetails: ${JSON.stringify(error.response?.data)}`);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto relative z-10">
      
      {/* 🚨 THE DEBUGGER TERMINAL - This will show us the truth */}
      <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-xs shadow-2xl mb-8">
        <div className="text-emerald-400 font-black uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">
          🛠️ System Debugger (Raw Backend Data)
        </div>
        <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-64">
          {debugLog}
        </pre>
      </div>

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
        
        {/* TOTAL CLAIMS CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Claims</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">{stats.totalClaims}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">All time records</p>
        </div>

        {/* UNDER REVIEW CARD */}
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

        {/* APPROVED CARD */}
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

        {/* REJECTED CARD */}
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
    </div>
  );
};

export default AdminDashboard;