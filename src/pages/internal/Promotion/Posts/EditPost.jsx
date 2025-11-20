import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPostApi from '@/services/api/promotionPostApi';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';
import Toast from '@/components/ui/Internal/Toast/Toast';
import useToast from '@/hooks/useToast';
import { SOURCES } from '@/config/constants';

function FieldLabel({ children }) {
  return <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{children}</label>;
}

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [partner, setPartner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', post_platform: 'facebook', post_url: '' });
  const [errors, setErrors] = useState({});
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(()=>{
    (async()=>{
      try {
        const res = await promotionPostApi.getPost(id);
        if (res.success) {
          setPost(res.data);
          setForm({
            title: res.data.title || '',
            description: res.data.description || '',
            post_platform: res.data.post_platform || 'facebook',
            post_url: res.data.post_url || '',
          });
          if (res.data.partner_id) {
            const p = await promotionPartnerApi.getPartner(res.data.partner_id);
            if (p.success) setPartner(p.data);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const previewLink = useMemo(()=>{
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const code = partner?.referral_code || 'XXXXXXX';
    const source = form.post_platform || 'facebook';
    return `${base}/ref?code=${encodeURIComponent(code)}&post=${encodeURIComponent(id)}&source=${encodeURIComponent(source)}`;
  }, [partner, form.post_platform, id]);

  const setField = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title || form.title.trim().length < 5 || form.title.trim().length > 200) e.title = 'Title must be 5-200 characters';
    if (form.description && form.description.length > 500) e.description = 'Max 500 characters';
    if (!form.post_platform) e.post_platform = 'Source is required';
    if (form.post_url && !/^https?:\/\//i.test(form.post_url)) e.post_url = 'Enter a valid URL';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        post_platform: form.post_platform,
        post_url: form.post_url || undefined,
      };
      const res = await promotionPostApi.updatePost(id, payload);
      if (res.success) {
        showSuccess(res.message || 'Post updated successfully!');
        setTimeout(() => {
          navigate(`/admin/promotion/posts/${id}`);
        }, 1500);
      } else {
        showError(res.message || 'Failed to update post');
      }
    } catch (err) { 
      console.error('Update post failed', err);
      showError('An error occurred while updating the post');
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
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Edit Promotional Post</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update post details</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Associated Partner</FieldLabel>
              <input value={partner ? `${partner.name}${partner.referral_code ? ` (${partner.referral_code})` : ''}` : ''} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/60 text-sm" />
              <p className="text-xs text-gray-500 mt-1">Partner cannot be changed</p>
            </div>
            <div>
              <FieldLabel>Source *</FieldLabel>
              <select value={form.post_platform} onChange={(e)=>setField('post_platform', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
                {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.post_platform && <p className="text-xs text-red-600 mt-1">{errors.post_platform}</p>}
            </div>
            <div>
              <FieldLabel>Post Title *</FieldLabel>
              <input value={form.title} onChange={(e)=>setField('title', e.target.value)} placeholder="Enter post title" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>
            <div>
              <FieldLabel>Post URL</FieldLabel>
              <input value={form.post_url} onChange={(e)=>setField('post_url', e.target.value)} placeholder="https://earthmoversacademy.com/courses" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
              {errors.post_url && <p className="text-xs text-red-600 mt-1">{errors.post_url}</p>}
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Description</FieldLabel>
              <textarea value={form.description} onChange={(e)=>setField('description', e.target.value)} placeholder="Enter post description..." rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
              <div className="text-xs text-gray-500 mt-1">{form.description.length}/500</div>
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Generated Link</h3>
          <div className="text-sm text-gray-800 dark:text-gray-100 break-all">{previewLink}</div>
          {post?.updatedAt && <div className="text-xs text-gray-500 mt-3">Last Updated: {new Date(post.updatedAt).toLocaleString()}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={()=>window.history.back()} className="btn">Cancel</button>
          <button type="submit" disabled={submitting} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">{submitting ? 'Updating...' : 'Update Post'}</button>
        </div>
      </form>

      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}
