'use client';

import React from 'react';
import { Box, Chip } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import { NotificationTypeFilter } from '../types/notification';

interface FilterBarProps {
  activeFilter: NotificationTypeFilter;
  onChange: (filter: NotificationTypeFilter) => void;
  counts?: Record<NotificationTypeFilter, number>;
}

const filterOptions: { label: NotificationTypeFilter; icon: React.ReactElement; color: string }[] = [
  { label: 'All', icon: <AllInboxIcon sx={{ fontSize: 16 }} />, color: '#6366f1' },
  { label: 'Placement', icon: <BusinessCenterIcon sx={{ fontSize: 16 }} />, color: '#6366f1' },
  { label: 'Result', icon: <AssessmentIcon sx={{ fontSize: 16 }} />, color: '#10b981' },
  { label: 'Event', icon: <EventIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
];

export function FilterBar({ activeFilter, onChange, counts }: FilterBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        overflowX: 'auto',
        pb: 1,
        mb: 2,
        scrollbarWidth: 'none', // hide scrollbar on Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // hide scrollbar on Chrome/Safari
        },
      }}
    >
      {filterOptions.map((opt) => {
        const isSelected = activeFilter === opt.label;
        const count = counts ? counts[opt.label] : null;
        
        return (
          <Chip
            key={opt.label}
            icon={opt.icon}
            label={count !== null ? `${opt.label} (${count})` : opt.label}
            onClick={() => onChange(opt.label)}
            sx={{
              fontWeight: 700,
              fontSize: '13px',
              px: 0.5,
              height: '36px',
              backgroundColor: isSelected
                ? opt.color
                : (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
              color: isSelected ? '#ffffff' : 'text.primary',
              borderColor: isSelected ? 'transparent' : 'divider',
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: isSelected ? `0 4px 10px ${opt.color}33` : 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isSelected
                  ? opt.color
                  : (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
              },
              '& .MuiChip-icon': {
                color: isSelected ? '#ffffff' : 'inherit',
              },
            }}
          />
        );
      })}
    </Box>
  );
}
export default FilterBar;
