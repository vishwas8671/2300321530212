'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import SpeedIcon from '@mui/icons-material/Speed';
import HubIcon from '@mui/icons-material/Hub';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { darkTheme, lightTheme } from '../theme/theme';
import { logFrontend } from '../services/api';

const DRAWER_WIDTH = 280;

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMdUp = useMediaQuery('(min-width: 900px)');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme_preference') as 'dark' | 'light';
    if (saved) {
      setMode(saved);
    }
    logFrontend('info', 'component', `Page loaded: "${pathname}"`);
  }, [pathname]);

  const activeTheme = mode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('theme_preference', nextMode);
    logFrontend('debug', 'component', `Theme switched to: "${nextMode}"`);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { text: 'All Notifications', icon: <AllInboxIcon />, path: '/' },
    { text: 'Priority Inbox', icon: <SpeedIcon />, path: '/priority' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    logFrontend('debug', 'component', `Navigation triggered to: "${path}"`);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
        }}
      >
        <HubIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
          AffordMed Hub
        </Typography>
      </Box>
      <Divider />

      {/* Nav List */}
      <List sx={{ px: 2, py: 3, flex: 1 }}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 2,
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                  border: isActive ? '1px solid' : '1px solid transparent',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      {/* Footer System Status */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 16 }} />
        <Typography variant="caption" fontWeight={600}>
          Logs API Connected
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: isMdUp ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
            ml: isMdUp ? `${DRAWER_WIDTH}px` : 0,
            backgroundImage: 'none',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
            <Box display="flex" alignItems="center" gap={1}>
              {!isMdUp && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.01em' }}>
                {pathname === '/priority' ? 'Priority Inbox' : 'All Notifications'}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {/* Theme Selector */}
              <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: isMdUp ? DRAWER_WIDTH : 0, flexShrink: 0 }}
        >
          {isMdUp ? (
            <Drawer
              variant="permanent"
              open
              sx={{
                '& .MuiDrawer-paper': {
                  width: DRAWER_WIDTH,
                  boxSizing: 'border-box',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                },
              }}
            >
              {drawerContent}
            </Drawer>
          ) : (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                '& .MuiDrawer-paper': {
                  width: DRAWER_WIDTH,
                  boxSizing: 'border-box',
                  backgroundColor: 'background.paper',
                },
              }}
            >
              {drawerContent}
            </Drawer>
          )}
        </Box>

        {/* Content View */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: '80px',
            pb: 6,
            minHeight: '100vh',
            width: isMdUp ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Layout;
