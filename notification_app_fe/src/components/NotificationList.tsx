'use client';

import React from 'react';
import { Stack, Skeleton, Card, CardContent, Box, Typography, Alert, AlertTitle, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Notification } from '../types/notification';
import NotificationCard from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  viewedIds: Set<string>;
  onView: (id: string) => void;
  onRetry?: () => void;
}

export function NotificationList({
  notifications,
  loading,
  error,
  viewedIds,
  onView,
  onRetry,
}: NotificationListProps) {
  
  // Render loading Skeletons
  if (loading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} sx={{ borderLeft: '5px solid rgba(255, 255, 255, 0.12)' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="rounded" width={48} height={48} />
                <Box flex={1}>
                  <Skeleton variant="text" width="120px" height="20px" sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="85%" height="24px" sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="160px" height="16px" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Render error message
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
              RETRY
            </Button>
          )
        }
        sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <AlertTitle sx={{ fontWeight: 700 }}>Unable to Load Notifications</AlertTitle>
        {error}
      </Alert>
    );
  }

  // Render empty state
  if (notifications.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          textAlign: 'center',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          No Notifications
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '300px' }}>
          There are no alerts corresponding to the selected filter category at the moment.
        </Typography>
      </Box>
    );
  }

  // Render Notification list
  return (
    <Stack spacing={2}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          isViewed={viewedIds.has(notification.ID)}
          onView={onView}
        />
      ))}
    </Stack>
  );
}
export default NotificationList;
