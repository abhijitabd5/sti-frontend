import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';

function PartnerForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    mobile: initial.mobile || '',
    commission_rate: initial.commission_rate ?? '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 3) e.name = 'Name is required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.mobile || form.mobile.replace(/\D/g,'').length < 7) e.mobile = 'Mobile number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      commission_rate: form.commission_rate !== '' ? Number(form.commission_rate) : undefined,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name *</label>
        <input
          value={form.name}
          onChange={(e)=>handleChange('name', e.target.value)}
          placeholder="Enter partner name"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e)=>handleChange('email', e.target.value)}
          placeholder="partner@example.com"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mobile Number *</label>
        <input
          value={form.mobile}
          onChange={(e)=>handleChange('mobile', e.target.value)}
          placeholder="+91-9876543210"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
        />
        {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Commission Rate (%)</label>
        <input
          type="number"
          step="0.01"
          value={form.commission_rate}
          onChange={(e)=>handleChange('commission_rate', e.target.value)}
          placeholder="10"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => window.history.back()} className="btn">Cancel</button>
        <button type="submit" disabled={submitting} className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600">
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default function CreatePartner() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const res = await promotionPartnerApi.createPartner(payload);
      if (res.success) {
        navigate('/admin/promotion/partners');
      }
    } catch (e) {
      console.error('Create failed', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Create New Partner</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Add a new promotional partner</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Personal Information</h3>
        <PartnerForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </AdminLayout>
  );
}
