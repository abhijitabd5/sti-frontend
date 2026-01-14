import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';
import promotionPostApi from '@/services/api/promotionPostApi';

import { LinkIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const SOURCES = ['facebook','instagram','youtube','tiktok','whatsapp','threads','offline','sms_campaign','other'];

export default function CreateLink() {
  const [partners, setPartners] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({ source: 'facebook', partnerId: '', postId: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await promotionPartnerApi.listPartners({ page: 1, limit: 200, is_active: true });
        if (res.success) setPartners(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoadingPartners(false); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!form.partnerId) { setPosts([]); setForm(s => ({ ...s, postId: '' })); return; }
      setLoadingPosts(true);
      try {
        const res = await promotionPostApi.listPartnerPosts(form.partnerId, { page: 1, limit: 500 });
        if (res.success) setPosts(res.data || []);
        else setPosts([]);
      } catch (e) { console.error(e); setPosts([]); }
      finally { setLoadingPosts(false); }
    })();
  }, [form.partnerId]);

  const link = useMemo(() => {
    const base = import.meta.env.VITE_PROMOTION_BASE_URL || 'https://api.shahabuddintraining.com';
    const partner = partners.find(p => String(p.id) === String(form.partnerId));
    const post = posts.find(pt => String(pt.id) === String(form.postId));
    const code = partner?.referral_code || '';
    const pid = post?.id || '';
    const src = form.source || '';
    
    // Link becomes active when source and partner are selected
    if (!src || !code) return '';
    
    const params = new URLSearchParams();
    params.append('source', src);
    params.append('code', code);
    if (pid) params.append('post', pid);
    
    return `${base}/ref?${params.toString()}`;
  }, [partners, posts, form]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Create Referral Link</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate a referral link by selecting source, partner, and post</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Source</label>
            <select
              value={form.source}
              onChange={(e)=>setForm(s => ({ ...s, source: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Partner</label>
            <select
              value={form.partnerId}
              onChange={(e)=>setForm(s => ({ ...s, partnerId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
            >
              <option value="">{loadingPartners ? 'Loading...' : 'Select Partner'}</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name}{p.referral_code ? ` (${p.referral_code})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Post</label>
            <select
              value={form.postId}
              disabled={!form.partnerId || loadingPosts}
              onChange={(e)=>setForm(s => ({ ...s, postId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm disabled:opacity-50"
            >
              <option value="">{!form.partnerId ? 'Select partner first' : (loadingPosts ? 'Loading...' : 'Select Post')}</option>
              {posts.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Generated Link</label>
          <div className="relative">
            <input
              value={link}
              readOnly
              placeholder="Select source, partner and post to generate link"
              className="w-full pr-28 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/60 text-sm"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                onClick={copy}
                disabled={!link}
                className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                title={copied ? 'Link copied' : 'Copy link'}
              >
                <ClipboardIcon className="h-4 w-4 mr-2" /> Copy
              </button>
            </div>
            {copied && (
              <div className="absolute -top-8 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow">
                Link copied
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
          {link && (
            <div className="text-xs text-gray-500 mt-2 break-all">{link}</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
