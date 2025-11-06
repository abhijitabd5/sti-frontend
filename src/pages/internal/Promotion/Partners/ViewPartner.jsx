import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';
import promotionPostApi from '@/services/api/promotionPostApi';

import { ArrowLeftIcon, PencilIcon, TrashIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const InfoRow = ({ label, value, link }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    {link ? (
      <a href={link} className="text-gray-900 dark:text-gray-100 hover:underline" target="_blank" rel="noreferrer">{value}</a>
    ) : (
      <span className="text-gray-900 dark:text-gray-100">{value}</span>
    )}
  </div>
);

export default function ViewPartner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, postsRes] = await Promise.all([
          promotionPartnerApi.getPartner(id),
          promotionPostApi.listPartnerPosts(id, { page: 1, limit: 5 })
        ]);
        if (pRes.success) setPartner(pRes.data);
        if (postsRes.success) setPosts(postsRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(partner?.referral_code || ''); } catch {}
  };

  const clicks = useMemo(() => partner?.stats?.clicks ?? '-', [partner]);
  const conversions = useMemo(() => partner?.stats?.conversions ?? '-', [partner]);
  const convRate = useMemo(() => {
    if (typeof clicks === 'number' && clicks > 0 && typeof conversions === 'number') {
      return `${((conversions / clicks) * 100).toFixed(2)}%`;
    }
    return partner?.stats?.conversion_rate ?? '-';
  }, [clicks, conversions, partner]);
  const commission = useMemo(() => partner?.stats?.commission_total ?? '-', [partner]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!partner) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600 dark:text-gray-400">Partner not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/promotion/partners')} className="btn">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Partners
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/admin/promotion/partners/${partner.id}/edit`)} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">
            <PencilIcon className="h-4 w-4 mr-2" /> Edit
          </button>
          <button onClick={async ()=>{ if (confirm('Delete this partner?')) { const res = await promotionPartnerApi.deletePartner(partner.id); if (res.success) navigate('/admin/promotion/partners'); } }} className="btn bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700">
            <TrashIcon className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Personal Info</h3>
          <InfoRow label="Name" value={partner.name} />
          <InfoRow label="Email" value={partner.email} link={`mailto:${partner.email}`} />
          <InfoRow label="Mobile" value={partner.mobile} link={`tel:${partner.mobile}`} />
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Referral</span>
            <span className="text-gray-900 dark:text-gray-100 inline-flex items-center gap-2">
              {partner.referral_code}
              <button onClick={copyCode} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Copy">
                <ClipboardIcon className="h-4 w-4" />
              </button>
            </span>
          </div>
          <InfoRow label="Status" value={(partner.status || (partner.is_active ? 'active' : 'inactive')).toUpperCase()} />
          {partner.commission_rate != null && <InfoRow label="Commission" value={`${partner.commission_rate}%`} />}
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Performance Summary</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60">
              <div className="text-xs text-gray-500">Total Clicks</div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{clicks}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60">
              <div className="text-xs text-gray-500">Conversions</div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{conversions}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60">
              <div className="text-xs text-gray-500">Conv. Rate</div>
              <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{convRate}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60">
              <div className="text-xs text-gray-500">Total Commission</div>
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100">{commission}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60">
              <div className="text-xs text-gray-500">Joined</div>
              <div className="text-sm text-gray-800 dark:text-gray-100">{partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : '-'}</div>
              <div className="text-xs text-gray-500 mt-1">Last Updated: {partner.updatedAt ? new Date(partner.updatedAt).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 mb-6">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Associated Promotional Posts ({posts.length})</h3>
          <button className="btn">View All ►</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
              {posts.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No posts</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{post.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{post.post_platform}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{post.is_active ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Recent Activity</h3>
        </div>
        <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
          <p>No activity data available.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
