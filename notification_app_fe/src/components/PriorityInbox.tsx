'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SpeedIcon from '@mui/icons-material/Speed';
import { Notification, TopNLimit } from '../types/notification';
import { calculatePriorityScore, MinHeap } from '../utils/priority';

interface PriorityInboxProps {
  notifications: Notification[];
  loading: boolean;
  onView: (id: string) => void;
  viewedIds: Set<string>;
}

// Map rank number to color palette
const getRankBadgeProps = (rank: number) => {
  switch (rank) {
    case 1:
      return { bg: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)', color: '#0b0f19', text: '1st' };
    case 2:
      return { bg: 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)', color: '#0b0f19', text: '2nd' };
    case 3:
      return { bg: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)', color: '#ffffff', text: '3rd' };
    default:
      return { bg: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', color: '#cbd5e1', text: `${rank}th` };
  }
};

// Map type to icon and colors
const getTypeDetails = (type: string) => {
  const t = type.toLowerCase();
  switch (t) {
    case 'placement':
      return { icon: <BusinessCenterIcon sx={{ fontSize: 18 }} />, color: '#6366f1' };
    case 'result':
      return { icon: <AssessmentIcon sx={{ fontSize: 18 }} />, color: '#10b981' };
    case 'event':
      return { icon: <EventIcon sx={{ fontSize: 18 }} />, color: '#f59e0b' };
    default:
      return { icon: <NotificationsActiveIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6' };
  }
};

export function PriorityInbox({ notifications, loading, onView, viewedIds }: PriorityInboxProps) {
  const [limit, setLimit] = useState<TopNLimit>(10);

  // Calculate top notifications using MinHeap on the frontend
  const rankedNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    // Create a Min-Heap of max size limit
    const heap = new MinHeap<Notification & { priorityScore: number }>((a, b) => a.priorityScore - b.priorityScore);
    
    notifications.forEach((item) => {
      const score = calculatePriorityScore(item);
      heap.insertBounded({ ...item, priorityScore: score }, limit);
    });

    return heap.toSortedArray();
  }, [notifications, limit]);

  const handleLimitChange = (
    event: React.MouseEvent<HTMLElement>,
    newLimit: TopNLimit | null
  ) => {
    if (newLimit !== null) {
      setLimit(newLimit);
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr.replace(' ', 'T'));
      if (isNaN(date.getTime())) return timeStr;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <Box>
      {/* Configuration Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <SpeedIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
            Priority Threshold (Top N)
          </Typography>
        </Box>
        <ToggleButtonGroup
          color="primary"
          value={limit}
          exclusive
          onChange={handleLimitChange}
          size="small"
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ToggleButton value={10} sx={{ fontWeight: 700, px: 2 }}>Top 10</ToggleButton>
          <ToggleButton value={15} sx={{ fontWeight: 700, px: 2 }}>Top 15</ToggleButton>
          <ToggleButton value={20} sx={{ fontWeight: 700, px: 2 }}>Top 20</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Ranked List */}
      <Stack spacing={2}>
        {rankedNotifications.map((notif, index) => {
          const rank = index + 1;
          const badge = getRankBadgeProps(rank);
          const typeDetails = getTypeDetails(notif.Type);
          const isViewed = viewedIds.has(notif.ID);

          return (
            <Card
              key={notif.ID}
              onClick={() => onView(notif.ID)}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: isViewed ? 0.75 : 1,
                backgroundColor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? isViewed ? 'rgba(17, 24, 39, 0.4)' : 'rgba(17, 24, 39, 0.85)'
                    : isViewed ? '#f8fafc' : '#ffffff',
                borderLeft: `5px solid ${typeDetails.color}`,
                boxShadow: rank <= 3 ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 30px ${typeDetails.color}20`,
                  borderColor: typeDetails.color,
                },
              }}
            >
              <CardContent sx={{ py: '16px !important' }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Rank Badge */}
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        background: badge.bg,
                        color: badge.color,
                        fontWeight: 800,
                        fontSize: '14px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      {rank <= 3 ? <WorkspacePremiumIcon sx={{ fontSize: 20 }} /> : badge.text}
                    </Avatar>
                  </Grid>

                  {/* Notification Content */}
                  <Grid item xs>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ color: typeDetails.color }}>
                        {typeDetails.icon}
                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}>
                          {notif.Type}
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ height: 12, my: 0.5 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Score: {notif.priorityScore.toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isViewed ? 600 : 800,
                        color: 'text.primary',
                        my: 0.5,
                        fontSize: '15px',
                      }}
                    >
                      {notif.Message}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {formatTime(notif.Timestamp)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
export default PriorityInbox;
