'use client';

import React, { useEffect } from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Alert, AlertTitle, Fade } from '@mui/material';
import Layout from '../../components/Layout';
import PriorityInbox from '../../components/PriorityInbox';
import { useNotifications } from '../../hooks/useNotifications';
import { logFrontend } from '../../services/api';

export default function PriorityPage() {
  const { allNotifications, loading, error, viewedIds, markAsViewed } = useNotifications({
    page: 1,
    limit: 1000, // retrieve all for heap calculations
    typeFilter: 'All',
  });

  useEffect(() => {
    logFrontend('info', 'component', 'Priority Inbox opened by user.');
  }, []);

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          {/* Priority Intro Header */}
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(99, 102, 241, 0.02) 100%)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              Priority Inbox
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
              Your prioritized notifications stream, ranked automatically. High-priority Placements float to the top, accompanied by your latest Exam Results and Events.
            </Typography>
          </Paper>

          {/* Conditional Layouts based on Loading/Error states */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={12}>
              <CircularProgress size={50} thickness={4.5} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              <AlertTitle sx={{ fontWeight: 700 }}>Service Error</AlertTitle>
              {error}
            </Alert>
          ) : (
            <Grid container spacing={4}>
              {/* Prioritized Inbox List */}
              <Grid item xs={12} md={8}>
                <PriorityInbox
                  notifications={allNotifications}
                  loading={loading}
                  onView={markAsViewed}
                  viewedIds={viewedIds}
                />
              </Grid>

              {/* Priority Formula Explainer Sidebar */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'sticky',
                    top: '100px',
                  }}
                >
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Priority Algorithm
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Ranking is determined using a combination of the category weight and message recency.
                  </Typography>
                  
                  <Box
                    component="code"
                    sx={{
                      display: 'block',
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f1f5f9',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      color: 'primary.main',
                      mb: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    score = (weight × 10⁹) + timestampInMs
                  </Box>

                  <Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                    Category Weights:
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#6366f1' }} />
                    <Typography variant="body2" color="text.primary">
                      Placement: <strong>Weight 3</strong> (High)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="body2" color="text.primary">
                      Result: <strong>Weight 2</strong> (Medium)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                    <Typography variant="body2" color="text.primary">
                      Event: <strong>Weight 1</strong> (Low)
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Heap-based sorting ensures O(log K) insertion and keeps memory footprint minimal by preserving only the Top N items.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Fade>
    </Layout>
  );
}
