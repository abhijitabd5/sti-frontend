import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/common/Layouts/AdminLayout';
import promotionReportsApi from '@/services/api/promotionReportsApi';
import { getSourceLabel } from '@/config/constants';

// Icons
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

function PromotionReports() {
  // State management
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Data state
  const [topSources, setTopSources] = useState([]);
  const [topPartners, setTopPartners] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [partnersData, setPartnersData] = useState([]);
  const [partnerPostsData, setPartnerPostsData] = useState([]);
  const [partnersList, setPartnersList] = useState([]);
  const [selectedPartnerInfo, setSelectedPartnerInfo] = useState(null);

  // Loading states
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Load initial data
  useEffect(() => {
    loadSummaryData();
    loadPartnersList();
  }, [dateFrom, dateTo]);

  // Load table data when filters change
  useEffect(() => {
    if (selectedPartner) {
      loadPartnerPostsData(1);
    } else {
      loadPartnersData(1);
    }
  }, [selectedPartner, search, dateFrom, dateTo]);

  const loadSummaryData = async () => {
    setSummaryLoading(true);
    try {
      const params = {
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo })
      };

      const [sourcesRes, partnersRes, postsRes] = await Promise.all([
        promotionReportsApi.getTopSources(params),
        promotionReportsApi.getTopPartners(params),
        promotionReportsApi.getTopPosts(params)
      ]);

      if (sourcesRes.success) setTopSources(sourcesRes.data);
      if (partnersRes.success) setTopPartners(partnersRes.data);
      if (postsRes.success) setTopPosts(postsRes.data);
    } catch (error) {
      console.error('Error loading summary data:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadPartnersList = async () => {
    try {
      const response = await promotionReportsApi.getPartnersList();
      if (response.success) {
        setPartnersList(response.data);
      }
    } catch (error) {
      console.error('Error loading partners list:', error);
    }
  };

  const loadPartnersData = async (page = pagination.page) => {
    setTableLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(search && { search: search.trim() }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo })
      };

      const response = await promotionReportsApi.getPartnersReport(params);
      if (response.success) {
        setPartnersData(response.data);
        const p = response.pagination || {};
        setPagination({
          page: p.page || page,
          limit: p.limit || 10,
          total: p.total || 0,
          totalPages: p.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Error loading partners data:', error);
      setPartnersData([]);
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  const loadPartnerPostsData = async (page = pagination.page) => {
    if (!selectedPartner) return;
    
    setTableLoading(true);
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(search && { search: search.trim() }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo })
      };

      const response = await promotionReportsApi.getPartnerPostsReport(selectedPartner, params);
      if (response.success) {
        setPartnerPostsData(response.data);
        setSelectedPartnerInfo(response.partner_info);
        const p = response.pagination || {};
        setPagination({
          page: p.page || page,
          limit: p.limit || 10,
          total: p.total || 0,
          totalPages: p.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Error loading partner posts data:', error);
      setPartnerPostsData([]);
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {
        ...(search && { search: search.trim() }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo })
      };

      let response;
      let filename;

      if (selectedPartner) {
        response = await promotionReportsApi.exportPartnerPostsReport(selectedPartner, params);
        filename = `partner-${selectedPartnerInfo?.name || selectedPartner}-posts-report.csv`;
      } else {
        response = await promotionReportsApi.exportPartnersReport(params);
        filename = 'partners-report.csv';
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExporting(false);
    }
  };

  const serialStart = useMemo(() => (pagination.page - 1) * pagination.limit, [pagination.page, pagination.limit]);

  const resetFilters = () => {
    setSelectedPartner('');
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && !summaryLoading && !tableLoading) {
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
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Promotion Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Analytics and performance reports for promotional campaigns</p>
        </div>
        <div className="grid grid-flow-col sm:auto-cols-max gap-2">
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Top Sources */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Top Sources
            </h3>
          </div>
          {summaryLoading ? (
            <div className="animate-pulse space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
            </div>
          ) : (
            <div className="space-y-2">
              {topSources.map((source, index) => (
                <div key={source.source} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {index + 1}. {getSourceLabel(source.source)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {source.clicks.toLocaleString()}
                  </span>
                </div>
              ))}
              {topSources.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
              )}
            </div>
          )}
        </div>

        {/* Top Partners */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 flex items-center">
              <UsersIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              Top Partners
            </h3>
          </div>
          {summaryLoading ? (
            <div className="animate-pulse space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
            </div>
          ) : (
            <div className="space-y-2">
              {topPartners.map((partner, index) => (
                <div key={partner.partner_id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {index + 1}. {partner.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {partner.clicks.toLocaleString()}
                  </span>
                </div>
              ))}
              {topPartners.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
              )}
            </div>
          )}
        </div>

        {/* Top Posts */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              Top Posts
            </h3>
          </div>
          {summaryLoading ? (
            <div className="animate-pulse space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
            </div>
          ) : (
            <div className="space-y-2">
              {topPosts.map((post, index) => (
                <div key={post.post_id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate" title={post.title}>
                    {index + 1}. {post.title.length > 25 ? `${post.title.substring(0, 25)}...` : post.title}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {post.clicks.toLocaleString()}
                  </span>
                </div>
              ))}
              {topPosts.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        {/* Filters */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/60">
          <div className="space-y-3">
            {/* First Row - Search and Partner */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (selectedPartner ? loadPartnerPostsData(1) : loadPartnersData(1))}
                  placeholder={selectedPartner ? "Search posts..." : "Search partners..."}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100"
                />
              </div>
              
              <div className="md:w-64">
                <select 
                  value={selectedPartner} 
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
                >
                  <option value="">All Partners</option>
                  {partnersList.map(partner => (
                    <option key={partner.partner_id} value={partner.partner_id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Second Row - Date Range and Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-3 md:space-y-0">
              <div className="flex items-center space-x-2 flex-1">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
                  placeholder="From"
                />
                <span className="text-gray-400">to</span>
                <input 
                  type="date" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-sm"
                  placeholder="To"
                />
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => selectedPartner ? loadPartnerPostsData(1) : loadPartnersData(1)} 
                  className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  Apply
                </button>

                {(selectedPartner || search || dateFrom || dateTo) && (
                  <button 
                    onClick={resetFilters}
                    className="btn bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedPartner && selectedPartnerInfo && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Viewing posts for:</strong> {selectedPartnerInfo.name} ({selectedPartnerInfo.mobile})
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                {selectedPartner ? (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Clicks</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Partner Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Posts</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Clicks</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
              {tableLoading ? (
                <tr>
                  <td colSpan={selectedPartner ? 5 : 5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : selectedPartner ? (
                partnerPostsData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  partnerPostsData.map((post, idx) => (
                    <tr key={post.post_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{serialStart + idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium" title={post.title}>
                        {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {getSourceLabel(post.source)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
                        {post.total_clicks.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                partnersData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No partners found
                    </td>
                  </tr>
                ) : (
                  partnersData.map((partner, idx) => (
                    <tr key={partner.partner_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{serialStart + idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {partner.created_at ? new Date(partner.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">
                        {partner.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {partner.mobile}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                        {partner.total_posts}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
                        {partner.total_clicks.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(selectedPartner ? partnerPostsData : partnersData).length > 0 ? `${serialStart + 1}-${serialStart + (selectedPartner ? partnerPostsData : partnersData).length}` : 0} of {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.page <= 1} 
              onClick={() => selectedPartner ? loadPartnerPostsData(pagination.page - 1) : loadPartnersData(pagination.page - 1)} 
              className="btn disabled:opacity-50"
            >
              ◄
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {pagination.page} / {Math.max(1, pagination.totalPages)}
            </span>
            <button 
              disabled={pagination.page >= pagination.totalPages} 
              onClick={() => selectedPartner ? loadPartnerPostsData(pagination.page + 1) : loadPartnersData(pagination.page + 1)} 
              className="btn disabled:opacity-50"
            >
              ►
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default PromotionReports;