import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';

function PartnerForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    email: initial.email || '',
    mobile: initial.mobile || '',
    commission_rate: initial.commission_rate ?? '',
    status: initial.status || 'active',
    is_active: initial.is_active ?? true,
    referral_code: initial.referral_code || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    setForm({
      name: initial.name || '',
      email: initial.email || '',
      mobile: initial.mobile || '',
      commission_rate: initial.commission_rate ?? '',
      status: initial.status || 'active',
      is_active: initial.is_active ?? true,
      referral_code: initial.referral_code || '',
    })
  }, [initial])

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
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      commission_rate: form.commission_rate !== '' ? Number(form.commission_rate) : undefined,
      status: form.status,
      is_active: !!form.is_active,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name *</label>
          <input value={form.name} onChange={(e)=>handleChange('name', e.target.value)} placeholder="Enter partner name" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address *</label>
          <input type="email" value={form.email} onChange={(e)=>handleChange('email', e.target.value)} placeholder="partner@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Mobile Number *</label>
          <input value={form.mobile} onChange={(e)=>handleChange('mobile', e.target.value)} placeholder="+91-9876543210" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
          {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Commission Rate (%)</label>
          <input type="number" step="0.01" value={form.commission_rate} onChange={(e)=>handleChange('commission_rate', e.target.value)} placeholder="10" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Referral Code</label>
          <input value={form.referral_code} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/60 text-sm" />
          <p className="text-xs text-gray-500 mt-1">Auto-generated; cannot be edited</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
          <select value={form.status} onChange={(e)=>handleChange('status', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input type="checkbox" checked={form.is_active} onChange={(e)=>handleChange('is_active', e.target.checked)} className="form-checkbox" />
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => window.history.back()} className="btn">Cancel</button>
        <button type="submit" disabled={submitting} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Update Partner</button>
      </div>
    </form>
  );
}

export default function EditPartner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await promotionPartnerApi.getPartner(id);
        if (res.success) setPartner(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleUpdate = async (payload) => {
    setSubmitting(true);
    try {
      const res = await promotionPartnerApi.updatePartner(id, payload);
      if (res.success) {
        showSuccess(res.message || 'Partner updated successfully!');
        setTimeout(() => {
          navigate(`/admin/promotion/partners/${id}`);
        }, 1500);
      } else {
        showError(res.message || 'Failed to update partner');
      }
    } catch (e) { 
      console.error('Update failed', e);
      showError('An error occurred while updating the partner');
    }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Edit Partner</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update partner details</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Personal Information</h3>
        <PartnerForm initial={partner || {}} onSubmit={handleUpdate} submitting={submitting} />
        {partner?.updatedAt && (
          <p className="text-xs text-gray-500 mt-4">Last Updated: {new Date(partner.updatedAt).toLocaleString()}</p>
        )}
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}
