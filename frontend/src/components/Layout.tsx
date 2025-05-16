import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Box, BottomNavigation, 
  BottomNavigationAction, Paper, Container, IconButton, Menu, MenuItem 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  ReceiptLong as ReceiptIcon, 
  Archive as ArchiveIcon, 
  BarChart as AnalyticsIcon, 
  Person as ProfileIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Set navigation value based on current path
  useEffect(() => {
    if (location.pathname.includes('/dashboard')) setValue(0);
    else if (location.pathname.includes('/cargo-requests')) setValue(1);
    else if (location.pathname.includes('/closed-requests')) setValue(2);
    else if (location.pathname.includes('/analytics')) setValue(3);
    else if (location.pathname.includes('/profile')) setValue(4);
  }, [location.pathname]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  // Check if Telegram WebApp is available
  const isTelegramAvailable = window.Telegram?.WebApp;

  // Set up Telegram back button if available
  useEffect(() => {
    if (isTelegramAvailable && location.pathname !== '/dashboard') {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        navigate(-1);
      });
    } else if (isTelegramAvailable) {
      window.Telegram.WebApp.BackButton.hide();
    }
    
    return () => {
      if (isTelegramAvailable) {
        window.Telegram.WebApp.BackButton.offClick();
      }
    };
  }, [isTelegramAvailable, location.pathname, navigate]);

  return (
    <Box sx={{ flexGrow: 1, pb: 7 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {user && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 2 }}>
        {children}
      </Container>
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            switch (newValue) {
              case 0:
                navigate('/dashboard');
                break;
              case 1:
                navigate('/cargo-requests');
                break;
              case 2:
                navigate('/closed-requests');
                break;
              case 3:
                navigate('/analytics');
                break;
              case 4:
                navigate('/profile');
                break;
              default:
                break;
            }
          }}
        >
          <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Requests" icon={<ReceiptIcon />} />
          <BottomNavigationAction label="Closed" icon={<ArchiveIcon />} />
          <BottomNavigationAction label="Analytics" icon={<AnalyticsIcon />} />
          <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout; 