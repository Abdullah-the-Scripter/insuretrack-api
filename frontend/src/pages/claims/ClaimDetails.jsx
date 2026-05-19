import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

//  UPDATED STATUS BADGES FOR ADAPTIVE TEXT IN LIGHT/DARK MODES
const STATUS_BADGE = {
  approved: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  settled: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30',
  rejected: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  submitted: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  'under review': 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  'additional info required': 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
};

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [claim, setClaim] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchClaimData = useCallback(async () => {
    const res = await axiosInstance.get(`/claims/${id}`);
    return res.data;
  }, [id]);

  const fetchCommentsData = useCallback(async () => {
    const res = await axiosInstance.get(`/claims/comment/${id}`);
    return res.data;
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [claimData, commentsData] = await Promise.all([fetchClaimData(), fetchCommentsData()]);
        if (isMounted) { setClaim(claimData); setComments(commentsData); }
      } catch (e) { 
        toast.error('Failed to load claim details.');
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchClaimData, fetchCommentsData]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      await axiosInstance.post('/claims/comment', { message: newComment, claimId: id });
      setNewComment('');
      setComments(await fetchCommentsData());
      toast.success('Update posted successfully!');
    } catch (e) { toast.error('Failed to post comment.'); }
    finally { setIsPosting(false); }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await axiosInstance.put(`/claims/${id}`, { status });
      setClaim(await fetchClaimData());
      toast.success(`Status updated to ${status}`);
    } catch (e) { toast.error('Failed to update status.'); }
  };

  const handleSelfAssign = async () => {
    try {
      await axiosInstance.put(`/claims/${id}/assign`, { officerId: user.id });
      setClaim(await fetchClaimData());
      toast.success('Claim assigned to you.');
    } catch (e) { toast.error('Failed to assign claim.'); }
  };

  if (!claim) return <Loader text="Loading claim details..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 relative z-10">
      
      {/*  NAVIGATION BREADCRUMB */}
      <div className="flex items-center gap-3 text-sm font-bold">
        <button onClick={() => navigate('/claims')} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
          ← Back to Queue
        </button>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-slate-900 dark:text-white font-black">Claim #{String(claim.id).padStart(4, '0')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: MAIN CLAIM CARD & COMMUNICATION TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MAIN INTAKE INFRASTRUCTURE DETAILS */}
          <Card delay={0.1}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-wider backdrop-blur-sm ${STATUS_BADGE[claim.status]}`}>
                    {claim.status}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 uppercase tracking-wider backdrop-blur-sm">
                    {claim.type || 'General'}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  {claim.title}
                </h1>
              </div>
            </div>

            <div className="max-w-none">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 dark:border-white/10 pb-2">
                Incident Report
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed text-sm">
                {claim.description}
              </p>
            </div>

            {/* ATTACHED DIGITAL EVIDENCE HOVER CHASSIS */}
            {claim.documentMetadata?.fileUrl && (
              <div className="mt-8 p-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between gap-3 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <svg className="w-6 h-6 text-blue-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {claim.documentMetadata.originalName || claim.documentMetadata.fileName}
                    </p>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Attached Document</p>
                  </div>
                </div>
                <a 
                  href={claim.documentMetadata.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/20 transition-all shadow-sm"
                >
                  View File
                </a>
              </div>
            )}
          </Card>

          {/* TIMELINE HUB */}
          <Card delay={0.2}>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-white/10 pb-2">
              Communication Timeline
            </h3>
            
            <div className="space-y-6 mb-8">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic">No updates have been posted yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-300 flex-shrink-0 shadow-inner">
                      {c.user?.name ? c.user.name[0].toUpperCase() : 'S'}
                    </div>
                    <div className="flex-1 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md rounded-2xl rounded-tl-none p-5 border border-slate-200/60 dark:border-white/10 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{c.user?.name ?? 'System Automated'}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          {new Date(c.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{c.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CORE INTERACTIVE MESSAGE DISPATCHER */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <input
                type="text"
                className="flex-1 text-sm bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                placeholder="Post an update or request information..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <Button type="submit" disabled={isPosting || !newComment.trim()}>
                {isPosting ? '...' : 'Post Reply'}
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: ACTION METADATA SIDEPANELS */}
        <div className="space-y-6">
          
          {/* ADJUSTER ACTION CONTROLS PANEL */}
          {user?.role === 'officer' && (
            <div className="rounded-3xl p-6 bg-gradient-to-b from-blue-500/10 to-indigo-500/10 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-500/20 dark:border-blue-500/30 backdrop-blur-3xl shadow-lg">
              <h3 className="text-xs font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest mb-4 border-b border-blue-500/20 dark:border-blue-500/30 pb-2">
                Officer Actions
              </h3>
              <div className="space-y-4">
                {!claim.assignedOfficer && (
                  <Button variant="primary" className="w-full" onClick={handleSelfAssign}>
                    Assign To Me
                  </Button>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">Update Status</label>
                  <select
                    className="w-full text-sm font-bold border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 bg-white dark:bg-black/40 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 shadow-inner cursor-pointer"
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    value={claim.status}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under review">Under Review</option>
                    <option value="additional info required">Info Required</option>
                    <option value="approved">Approve Claim</option>
                    <option value="rejected">Reject Claim</option>
                    <option value="settled">Mark as Settled</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC IMMUTABLE METADATA LOGS */}
          <Card delay={0.4}>
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
              Metadata
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Policyholder</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">{claim.user?.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date Submitted</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">
                  {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Assigned Adjuster</dt>
                <dd className="text-sm font-bold text-slate-900 dark:text-white">
                  {claim.assignedOfficer ? claim.assignedOfficer.name : <span className="text-amber-600 dark:text-amber-400 italic">Unassigned</span>}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ClaimDetails;