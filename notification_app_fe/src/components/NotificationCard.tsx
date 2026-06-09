'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Badge } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Notification } from '../types/notification';
import { ViewedBadge } from './ViewedBadge';

interface NotificationCardProps {
  notification: Notification;
  isViewed: boolean;
  onView: (id: string) => void;
}

// Icon mapper helper
const getTypeDetails = (type: string) => {
  const t = type.toLowerCase();
  switch (t) {
    case 'placement':
      return {
        icon: <BusinessCenterIcon sx={{ fontSize: 24 }} />,
        color: '#6366f1', // Indigo
        bg: 'rgba(99, 102, 241, 0.07)',
        label: 'Placement',
      };
    case 'result':
      return {
        icon: <AssessmentIcon sx={{ fontSize: 24 }} />,
        color: '#10b981', // Emerald/Green
        bg: 'rgba(16, 185, 129, 0.07)',
        label: 'Result',
      };
    case 'event':
      return {
        icon: <EventIcon sx={{ fontSize: 24 }} />,
        color: '#f59e0b', // Amber/Orange
        bg: 'rgba(245, 158, 11, 0.07)',
        label: 'Event',
      };
    default:
      return {
        icon: <NotificationsActiveIcon sx={{ fontSize: 24 }} />,
        color: '#8b5cf6', // Purple
        bg: 'rgba(139, 92, 246, 0.07)',
        label: type,
      };
  }
};

export function NotificationCard({ notification, isViewed, onView }: NotificationCardProps) {
  const details = getTypeDetails(notification.Type);

  // Formatter for timestamp: "2026-04-22 17:51:18" -> prettified string
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <Card
      onClick={() => onView(notification.ID)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? isViewed ? 'rgba(17, 24, 39, 0.6)' : 'rgba(17, 24, 39, 0.95)'
            : isViewed ? '#f8fafc' : '#ffffff',
        borderLeft: `5px solid ${details.color}`,
        borderRadius: 2,
        opacity: isViewed ? 0.75 : 1,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateX(4px)',
          opacity: 1,
        }
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Grid container spacing={2} alignItems="center">
          {/* Icon Section */}
          <Grid item>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: details.color,
                backgroundColor: details.bg,
                boxShadow: `0 4px 12px ${details.color}15`,
              }}
            >
              {details.icon}
            </Box>
          </Grid>

          {/* Details Section */}
          <Grid item xs>
            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" mb={0.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: details.color,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '11px',
                }}
              >
                {details.label}
              </Typography>
              <ViewedBadge isViewed={isViewed} />
            </Box>
            
            <Typography
              variant="body1"
              sx={{
                fontWeight: isViewed ? 500 : 700,
                color: 'text.primary',
                mb: 1,
                fontSize: '15px',
              }}
            >
              {notification.Message}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 500 }} suppressHydrationWarning>
                {formatTime(notification.Timestamp)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
export default NotificationCard;
