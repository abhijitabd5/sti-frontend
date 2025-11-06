import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPostApi from '@/services/api/promotionPostApi';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';
import ConfirmDeleteModal from '@/components/common/Modal/ConfirmDeleteModal';

import { ArrowLeftIcon, PencilIcon, TrashIcon, ClipboardIcon, ShareIcon } from '@heroicons/react/24/outline';

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>{children}</span>
);

const platformBadge = (platform) => {
  const map = {
    facebook: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300',
    youtube: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    whatsapp: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    tiktok: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    threads: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    offline: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    sms_campaign: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
  };
  return map[platform] || map.other;
};

export default function ViewPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [partner, setPartner] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await promotionPostApi.getPost(id);
        if (res.success) {
          setPost(res.data);
          if (res.data.partner_id) {
            const p = await promotionPartnerApi.getPartner(res.data.partner_id);
            if (p.success) setPartner(p.data);
          }
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const referralLink = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const code = partner?.referral_code || '';
    const src = post?.post_platform || 'facebook';
    return `${base}/ref?code=${encodeURIComponent(code)}&post=${encodeURIComponent(id)}&source=${encodeURIComponent(src)}`;
  }, [partner, post, id]);

  const copyLink = async () => { try { await navigator.clipboard.writeText(referralLink); } catch {} };

  const share = (platform) => {
    const url = encodeURIComponent(referralLink);
    const text = encodeURIComponent(post?.title || 'Check this out');
    const map = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: '',
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    const target = map[platform];
    if (target) window.open(target, '_blank');
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

  if (!post) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600 dark:text-gray-400">Post not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/promotion/posts')} className="btn">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Posts
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/promotion/posts/${id}/edit`)} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">
            <PencilIcon className="h-4 w-4 mr-2" /> Edit
          </button>
          <button onClick={() => setConfirmDelete(true)} className="btn bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700">
            <TrashIcon className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Post Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Title</span><span className="text-gray-900 dark:text-gray-100">{post.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Partner</span><button className="text-blue-600 dark:text-blue-400 hover:underline" onClick={()=>navigate(`/admin/promotion/partners/${post.partner_id}`)}>{post.partner_name}</button></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Type</span><Badge className={platformBadge(post.post_platform)}>{post.post_platform}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Status</span><Badge className={post.is_active ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300'}>{post.is_active ? 'Active' : 'Inactive'}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Created</span><span className="text-gray-900 dark:text-gray-100">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-'}</span></div>
          </div>
          {post.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100">Description</h4>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-1 whitespace-pre-wrap">{post.description}</p>
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Performance Summary</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60"><div className="text-xs text-gray-500">Total Clicks</div><div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{post.stats?.clicks ?? '-'}</div></div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60"><div className="text-xs text-gray-500">Top Source</div><div className="text-sm font-medium text-gray-800 dark:text-gray-100">{post.stats?.top_source ?? '-'}</div></div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60"><div className="text-xs text-gray-500">Conversions</div><div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{post.stats?.conversions ?? '-'}</div></div>
          </div>
          <div className="mt-4 text-xs text-gray-500">Last Click: {post.stats?.last_click_at ? new Date(post.stats.last_click_at).toLocaleString() : '-'}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Referral Link</h3>
          <button onClick={copyLink} className="btn"><ClipboardIcon className="h-4 w-4 mr-2" /> Copy</button>
        </div>
        <div className="p-4 text-sm text-gray-800 dark:text-gray-100 break-all">{referralLink}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60"><h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Share on Social Media</h3></div>
        <div className="p-4 flex flex-wrap gap-2">
          <button onClick={()=>share('facebook')} className="btn"><ShareIcon className="h-4 w-4 mr-2" /> Facebook</button>
          <button onClick={()=>share('twitter')} className="btn"><ShareIcon className="h-4 w-4 mr-2" /> Twitter</button>
          <button onClick={()=>share('whatsapp')} className="btn"><ShareIcon className="h-4 w-4 mr-2" /> WhatsApp</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60"><h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Click Analytics by Source</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
              {(post.stats?.sources || []).length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No analytics data</td></tr>
              ) : (
                (post.stats?.sources || []).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{row.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.clicks}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.conversions}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{row.rate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={async()=>{ const res = await promotionPostApi.deletePost(id); if (res.success) navigate('/admin/promotion/posts'); }}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </AdminLayout>
  );
}
