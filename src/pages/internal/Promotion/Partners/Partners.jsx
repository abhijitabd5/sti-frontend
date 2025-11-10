import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionPartnerApi from '@/services/api/promotionPartnerApi';

// Icons
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ClipboardIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const StatusBadge = ({ status, is_active }) => {
  const effective = status || (is_active ? 'active' : 'inactive');
  const map = {
    active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
    draft: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[effective] || map.inactive}`}>
      {effective === 'active' ? (
        <CheckCircleIcon className="h-4 w-4 mr-1" />
      ) : (
        <XCircleIcon className="h-4 w-4 mr-1" />
      )}
      {effective.charAt(0).toUpperCase() + effective.slice(1)}
    </span>
  );
};

function Partners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchList = async (page = pagination.page) => {
    setLoading(true);
    try {
      const res = await promotionPartnerApi.listPartners({
        page,
        limit: pagination.limit,
        search: search.trim(),
        status: status || '',
        date_from: dateFrom || '',
        date_to: dateTo || '',
      });
      if (res.success) {
        setPartners(res.data || []);
        const p = res.pagination || {};
        setPagination({
          page: p.page || p.current_page || page,
          limit: p.limit || p.per_page || 10,
          total: p.total || 0,
          totalPages: p.totalPages || p.last_page || 0,
        });
      } else {
        setPartners([]);
      }
    } catch (e) {
      console.error(e);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serialStart = useMemo(() => (pagination.page - 1) * pagination.limit, [pagination.page, pagination.limit]);

  const onCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text || '');
    } catch {}
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this partner? This action cannot be undone.')) return;
    try {
      const res = await promotionPartnerApi.deletePartner(id);
      if (res.success) fetchList(pagination.page);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const exportCsv = () => {
    const headers = ['#','Name','Mobile','Email','Referral Code','Status','Active'];
    const rows = partners.map((p, idx) => [
      serialStart + idx + 1,
      p.name || '',
      p.mobile || '',
      p.email || '',
      p.referral_code || '',
      p.status || '',
      p.is_active ? 'true' : 'false',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'partners.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Promotional Partners</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage referral partners and their performance</p>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max gap-2">
          <button onClick={() => navigate('/admin/promotion/partners/create')} className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Partner
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/60">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchList(1)}
                placeholder="Search by name, mobile, email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
              />
            </div>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="draft">Draft</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
            <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm" />
            <button onClick={() => fetchList(1)} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Apply</button>
            <button onClick={exportCsv} className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">Export CSV</button>
            <button onClick={() => navigate('/admin/promotion/partners/create')} className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600">
              <PlusIcon className="h-4 w-4 mr-2" /> Add Partner
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referral Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : partners.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No partners found</td></tr>
              ) : (
                partners.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{serialStart + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{p.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                      <div className="inline-flex items-center gap-2">
                        <span>{p.referral_code}</span>
                        <button onClick={() => onCopy(p.referral_code)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Copy">
                          <ClipboardIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} is_active={p.is_active} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => navigate(`/admin/promotion/partners/${p.id}`)} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => navigate(`/admin/promotion/partners/${p.id}/edit`)} className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(p.id)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Delete">
                          <TrashIcon className="h-4 w-4" />
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
            Showing {partners.length > 0 ? `${serialStart + 1}-${serialStart + partners.length}` : 0} of {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <button disabled={pagination.page <= 1} onClick={() => fetchList(pagination.page - 1)} className="btn disabled:opacity-50">◄</button>
            <span className="text-sm text-gray-700 dark:text-gray-200">{pagination.page} / {Math.max(1, pagination.totalPages)}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchList(pagination.page + 1)} className="btn disabled:opacity-50">►</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Partners;
