'use client';

import React, { useState, useMemo } from 'react';
import { Box, Paper, Grid, Typography, Pagination, Fade } from '@mui/material';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import NotificationList from '../components/NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationTypeFilter } from '../types/notification';

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>('All');

  const {
    notifications,
    allNotifications,
    loading,
    error,
    totalPages,
    totalCount,
    viewedIds,
    markAsViewed,
    refetch,
  } = useNotifications({
    page,
    limit: ITEMS_PER_PAGE,
    typeFilter,
  });

  // Calculate dynamic category counts for the filter badges
  const filterCounts = useMemo(() => {
    return {
      All: allNotifications.length,
      Placement: allNotifications.filter((n) => (n.Type || '').toLowerCase() === 'placement').length,
      Result: allNotifications.filter((n) => (n.Type || '').toLowerCase() === 'result').length,
      Event: allNotifications.filter((n) => (n.Type || '').toLowerCase() === 'event').length,
    };
  }, [allNotifications]);

  const handleFilterChange = (newFilter: NotificationTypeFilter) => {
    setTypeFilter(newFilter);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          {/* Welcome Dashboard Banner */}
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.02) 100%)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              Welcome back, Student!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
              Stay up-to-date with the latest placements, mid-sem exam marks, sports meet schedules, and technical campus events.
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            {/* Left Main Content */}
            <Grid item xs={12} md={8}>
              {/* Category Selector */}
              <FilterBar
                activeFilter={typeFilter}
                onChange={handleFilterChange}
                counts={filterCounts}
              />

              {/* Notification Stack */}
              <NotificationList
                notifications={notifications}
                loading={loading}
                error={error}
                viewedIds={viewedIds}
                onView={markAsViewed}
                onRetry={refetch}
              />

              {/* Pagination Controls */}
              {!loading && !error && totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="medium"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 700,
                      },
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Right Summary Sidebar (Aesthetic details) */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  position: 'sticky',
                  top: '100px',
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Inbox Summary
                </Typography>
                
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" color="text.secondary">Total Received</Typography>
                  <Typography variant="body2" fontWeight={700}>{allNotifications.length}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography variant="body2" color="text.secondary">Viewed alerts</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    {allNotifications.filter(n => viewedIds.has(n.ID)).length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="body2" color="text.secondary">Unread alerts</Typography>
                  <Typography variant="body2" fontWeight={700} color="secondary.main">
                    {allNotifications.filter(n => !viewedIds.has(n.ID)).length}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main" mb={0.5}>
                    Did you know?
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Placements represent highest priority followed by exam results and campus events. Check your Priority Inbox to see them sorted automatically!
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Layout>
  );
}
