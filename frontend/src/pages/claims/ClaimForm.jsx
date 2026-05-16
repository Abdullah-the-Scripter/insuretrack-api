import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CLAIM_TYPES = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'vehicle', label: 'Auto', icon: '🚗' },
  { value: 'property', label: 'Property', icon: '🏠' },
  { value: 'general', label: 'General', icon: '📋' },
];

const ClaimForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', type: 'medical', description: '', documentFile: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, documentFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('type', formData.type);
    submitData.append('description', formData.description);
    
    if (formData.documentFile) {
      submitData.append('document', formData.documentFile);
    }

    try {
      await axiosInstance.post('/claims', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Claim and document submitted successfully!');
      navigate('/claims');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8 pl-2">
        <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">File a New Claim</h1>
        <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">
          Please provide accurate details regarding your incident. Attach any supporting documentation (like a police report or photo) below.
        </p>
      </div>

      <Card delay={0.1} className="!p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-10 space-y-10">
            <Input 
              label="Claim Title (Brief Summary)" 
              type="text" 
              name="title" 
              required 
              placeholder="e.g. Rear-end collision on Main St." 
              onChange={handleChange} 
            />

            <div>
              <label className="block mb-3 text-sm font-bold text-slate-300 tracking-tight">Category of Claim</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CLAIM_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer text-center transition-all duration-300 ${
                      formData.type === t.value
                        ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-[1.02] backdrop-blur-sm'
                        : 'border-white/10 hover:border-white/30 text-slate-400 bg-black/20 hover:bg-white/5 backdrop-blur-sm'
                    }`}
                  >
                    <input type="radio" name="type" value={t.value} className="sr-only" onChange={handleChange} defaultChecked={t.value === 'medical'} />
                    <span className="text-3xl filter drop-shadow-sm">{t.icon}</span>
                    <span className="text-sm font-bold tracking-wide">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3 text-sm font-bold text-slate-300 tracking-tight">Detailed Incident Description</label>
              <textarea 
                name="description" 
                required 
                rows={6} 
                placeholder="Describe exactly what happened, including dates, times, and any third parties involved..." 
                className="w-full px-5 py-4 text-sm font-medium bg-black/20 border border-white/10 rounded-2xl focus:outline-none focus:bg-black/40 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-white transition-all resize-none placeholder-slate-500 shadow-inner" 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-bold text-slate-300 tracking-tight">Supporting Documentation</label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-white/20 px-6 py-10 hover:bg-white/5 transition-colors bg-black/20 backdrop-blur-sm">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-cyan-400 focus-within:outline-none hover:text-cyan-300 hover:underline drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                      <span>Select a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                    <p className="pl-1 font-medium text-slate-500">from your computer</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-2">PDF, PNG, or JPG up to 5MB</p>
                  
                  {formData.documentFile && (
                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl text-sm font-bold border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {formData.documentFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="px-6 py-6 bg-white/5 border-t border-white/10 flex items-center justify-between rounded-b-2xl">
            <button type="button" onClick={() => navigate('/claims')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-4 py-2">
              Cancel Draft
            </button>
            <Button type="submit" isLoading={isSubmitting} className="px-8 py-3 text-base">
              Submit Claim for Review
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ClaimForm;