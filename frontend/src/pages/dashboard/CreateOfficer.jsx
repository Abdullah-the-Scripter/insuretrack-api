import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const CreateOfficer = () => {
  const [officerData, setOfficerData] = useState({ name: '', email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await axiosInstance.post('/admin/officer', officerData);
      toast.success('Officer account created securely!');
      setOfficerData({ name: '', email: '', password: '' }); 
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create officer.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <Card delay={0.1}>
        <div className="mb-8 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-2">Create Claims Officer</h2>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            Generate credentials for new staff members. They will use this email and temporary password to access the Officer Queue.
          </p>
        </div>

        <form onSubmit={handleCreateOfficer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Jane Smith"
              value={officerData.name}
              onChange={(e) => setOfficerData({ ...officerData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="officer@insurance.com"
              value={officerData.email}
              onChange={(e) => setOfficerData({ ...officerData, email: e.target.value })}
            />
          </div>
          <Input
            label="Temporary Password"
            type="password"
            required
            placeholder="Min. 8 characters"
            value={officerData.password}
            onChange={(e) => setOfficerData({ ...officerData, password: e.target.value })}
          />
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto px-8" isLoading={isCreating}>
              Create Officer Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateOfficer;