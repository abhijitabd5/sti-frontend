import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPostApi from '@/services/api/promotionPostApi';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';

import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, LinkIcon } from '@heroicons/react/24/outline';
import ConfirmDeleteModal from '@/components/common/Modal/ConfirmDeleteModal';

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

const StatusBadge = ({ is_active, status }) => {
  const effective = status || (is_active ? 'active' : 'inactive');
  const map = {
    active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    draft: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[effective] || map.inactive}`}>{effective.charAt(0).toUpperCase()+effective.slice(1)}</span>;
};

function CopyLinkModal({ open, onClose, post, partner }) {
  const [platform, setPlatform] = useState(post?.post_platform || 'facebook');
  useEffect(()=>{ if(open){ setPlatform(post?.post_platform || 'facebook'); } }, [open, post]);
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const link = useMemo(()=>{
    const code = partner?.referral_code || '';
    const postId = post?.id || '';
    const src = platform || '';
    return `${base}/ref?code=${encodeURIComponent(code)}&post=${encodeURIComponent(postId)}&source=${encodeURIComponent(src)}`;
  }, [base, partner, post, platform]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500/60 dark:bg-gray-900/70" aria-hidden="true" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative z-[10000] inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white inline-flex items-center gap-2">
              <LinkIcon className="h-5 w-5" /> Copy Referral Link
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Select Source Platform</label>
              <select value={platform} onChange={(e)=>setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="threads">Threads</option>
                <option value="offline">Offline</option>
                <option value="sms_campaign">SMS Campaign</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Generated Link</label>
              <input value={link} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/60 text-sm" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="btn">Cancel</button>
            <button onClick={async()=>{ try{ await navigator.clipboard.writeText(link); }catch{}; onClose(); }} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Posts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copyTarget, setCopyTarget] = useState(null);
  const [copyPartner, setCopyPartner] = useState(null);

  const fetchPartners = async () => {
    try {
      const res = await promotionPartnerApi.listPartners({ page: 1, limit: 100, status: 'active' });
      if (res.success) setPartners(res.data || []);
    } catch {}
  };

  const fetchPosts = async (page = pagination.page) => {
    setLoading(true);
    try {
      const res = await promotionPostApi.listPosts({
        page,
        limit: pagination.limit,
        search: search.trim(),
        partner_id: partnerId || '',
        post_platform: source || '',
        is_active: status === '' ? '' : status === 'active' ? true : false,
      });
      if (res.success) {
        setPosts(res.data || []);
        const p = res.pagination || {};
        setPagination({
          page: p.page || p.current_page || page,
          limit: p.limit || p.per_page || 10,
          total: p.total || 0,
          totalPages: p.totalPages || p.last_page || 0,
        });
      } else {
        setPosts([]);
      }
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serialStart = useMemo(() => (pagination.page - 1) * pagination.limit, [pagination.page, pagination.limit]);

  const openCopyModal = async (post) => {
    setCopyTarget(post);
    try {
      const res = await promotionPartnerApi.getPartner(post.partner_id);
      if (res.success) setCopyPartner(res.data);
      else setCopyPartner(null);
    } catch { setCopyPartner(null); }
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Promotional Posts</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage promotional posts and links</p>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max gap-2">
          <button onClick={() => navigate('/admin/promotion/posts/create')} className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Post
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/60">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && fetchPosts(1)} placeholder="Search by title, description" className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100" />
            </div>
            <select value={partnerId} onChange={(e)=>setPartnerId(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
              <option value="">All Partners</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.referral_code ? `(${p.referral_code})` : ''}</option>
              ))}
            </select>
            <select value={source} onChange={(e)=>setSource(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
              <option value="">All Sources</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="threads">Threads</option>
              <option value="offline">Offline</option>
              <option value="sms_campaign">SMS Campaign</option>
              <option value="other">Other</option>
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            <button onClick={() => fetchPosts(1)} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Apply</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Partner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No posts found</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={()=>navigate(`/admin/promotion/posts/${post.id}`)}>{post.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-gray-800 dark:text-gray-100 hover:underline" onClick={()=>navigate(`/admin/promotion/partners/${post.partner_id}`)}>{post.partner_name}</button>
                    </td>
                    <td className="px-4 py-3 text-sm"><span className={`px-2 py-0.5 rounded text-xs font-medium ${platformBadge(post.post_platform)}`}>{post.post_platform}</span></td>
                    <td className="px-4 py-3 text-sm"><StatusBadge is_active={post.is_active} status={post.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{post.stats?.clicks ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => navigate(`/admin/promotion/posts/${post.id}`)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/promotion/posts/${post.id}/edit`)} className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(post)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => openCopyModal(post)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Copy Link">
                          <LinkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {posts.length > 0 ? `${serialStart + 1}-${serialStart + posts.length}` : 0} of {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <button disabled={pagination.page <= 1} onClick={() => fetchPosts(pagination.page - 1)} className="btn disabled:opacity-50">◄</button>
            <span className="text-sm text-gray-700 dark:text-gray-200">{pagination.page} / {Math.max(1, pagination.totalPages)}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchPosts(pagination.page + 1)} className="btn disabled:opacity-50">►</button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async()=>{ if (!deleteTarget) return; const res = await promotionPostApi.deletePost(deleteTarget.id); if(res.success){ setDeleteTarget(null); fetchPosts(pagination.page); } }}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      <CopyLinkModal open={!!copyTarget} onClose={()=>{ setCopyTarget(null); setCopyPartner(null); }} post={copyTarget} partner={copyPartner} />
    </AdminLayout>
  );
}
