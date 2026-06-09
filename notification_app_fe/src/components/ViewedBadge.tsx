'use client';

import React from 'react';
import { Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FiberNewIcon from '@mui/icons-material/FiberNew';

interface ViewedBadgeProps {
  isViewed: boolean;
}

export function ViewedBadge({ isViewed }: ViewedBadgeProps) {
  if (isViewed) {
    return (
      <Chip
        icon={<VisibilityIcon style={{ fontSize: '14px' }} />}
        label="VIEWED"
        size="small"
        variant="outlined"
        sx={{
          color: 'text.secondary',
          borderColor: 'divider',
          fontSize: '11px',
          fontWeight: 700,
          '& .MuiChip-icon': { color: 'text.secondary' },
        }}
      />
    );
  }

  return (
    <Chip
      icon={<FiberNewIcon style={{ fontSize: '16px' }} />}
      label="NEW"
      size="small"
      color="secondary"
      sx={{
        fontSize: '11px',
        fontWeight: 800,
        height: '24px',
        boxShadow: (theme) => `0 2px 8px ${theme.palette.secondary.main}33`,
        background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
      }}
    />
  );
}
