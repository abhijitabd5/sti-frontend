import React, { Suspense } from 'react';
import { AdminRoute } from '@/guards/ProtectedRoute';
import LazyLoadingFallback from '@/components/common/LazyLoadingFallback';
import ChunkErrorBoundary from '@/components/common/ChunkErrorBoundary';

// Lazy load the admin routes
const AdminRoutes = React.lazy(() => import('@/pages/internal/AdminRoutes'));

const LazyAdminWrapper = () => {
  return (
    <AdminRoute>
      <ChunkErrorBoundary>
        <Suspense fallback={<LazyLoadingFallback message="Loading Admin Dashboard..." />}>
          <AdminRoutes />
        </Suspense>
      </ChunkErrorBoundary>
    </AdminRoute>
  );
};

export default LazyAdminWrapper;