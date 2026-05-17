import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path if needed

const AdminDashboard = () => {
  // 1. Swap hardcoded mock data for dynamic React state
  const [stats, setStats] = useState({
    totalClaims: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  });

  // 2. Fetch live data from the backend when the dashboard loads
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        // Fetch the full list of claims from your existing endpoint
        const response = await axiosInstance.get('/claims');
        const claims = response.data;

        // Count them up dynamically based on their live status
        const total = claims.length;
        const underReviewCount = claims.filter(c => c.status === 'under review').length;
        const approvedCount = claims.filter(c => c.status === 'approved').length;
        const rejectedCount = claims.filter(c => c.status === 'rejected').length;

        // Update the screen with the real numbers
        setStats({
          totalClaims: total,
          underReview: underReviewCount,
          approved: approvedCount,
          rejected: rejectedCount
        });
      } catch (error) {
        console.error("Failed to load live metrics:", error);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto relative z-10">
      
      {/* 🔑 MAIN HEADER - Crisp Dark Slate for perfect readability */}
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Claims
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.totalClaims}
            </span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            All time records
          </p>
        </div>

        {/* UNDER REVIEW CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
              Under Review
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.underReview}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            Active caseload
          </p>
        </div>

        {/* APPROVED CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Approved
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.approved}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            0% success rate
          </p>
        </div>

        {/* REJECTED CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
              Rejected
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {stats.rejected}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            Declined claims
          </p>
        </div>

      </div>

      {/* 📉 PERFORMANCE REPORT SECTION */}
      <div className="relative rounded-2xl border border-white/40 dark:border-slate-800 bg-white/15 dark:bg-slate-900/20 backdrop-blur-3xl p-6 shadow-xl shadow-slate-200/30 dark:shadow-none transition-all duration-300 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
            Officer Performance Report
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Claims handled per assigned officer
          </p>
        </div>

        {/* EMPTY STATE CONTAINER */}
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-slate-300/50 dark:border-slate-800 bg-white/10 dark:bg-slate-950/20">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 text-center">
            No officers have been assigned claims yet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;