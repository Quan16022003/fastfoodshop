import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import InfoIcon from '@mui/icons-material/Info';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigationLinks = [
    { text: 'Đặt bàn', path: '/reservation', icon: <EventSeatIcon /> },
    { text: 'Quét mã', path: '/scan', icon: <QrCodeScannerIcon /> },
    { text: 'Trang chủ', path: '/', icon: <HomeIcon /> },
    { text: 'Thực đơn', path: '/menu', icon: <RestaurantMenuIcon /> },
    { text: 'Về chúng tôi', path: '/about', icon: <InfoIcon /> },
    { text: 'Liên hệ', path: '/contact', icon: <ContactsIcon /> },
  ];

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      showAlert('success', 'Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      showAlert('error', 'Có lỗi xảy ra khi đăng xuất');
    }
  };

  // Component cho menu di động
  const MobileDrawer = () => (
    <Drawer anchor="left" open={mobileMenuOpen} onClose={handleMobileMenuToggle}>
      <List sx={{ width: 250 }}>
        {navigationLinks.map((link) => (
          <ListItem 
            key={link.text} 
            disablePadding 
            onClick={() => {
              navigate(link.path);
              handleMobileMenuToggle();
            }}
          >
            <ListItemButton
              selected={location.pathname === link.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === link.path ? 'primary.main' : 'inherit'
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText 
                primary={link.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Component cho menu người dùng
  const UserMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
        Thông tin tài khoản
      </MenuItem>
      {user?.roles?.includes('ROLE_ADMIN') && (
        <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
          Quản trị
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            FASTFOOD
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navigationLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  startIcon={link.icon}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    backgroundColor: location.pathname === link.path ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    color: location.pathname === link.path ? 'primary.main' : 'inherit',
                    fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <IconButton onClick={handleMenu} color="inherit">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.username?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <UserMenu />
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="primary" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
                <Button color="primary" variant="contained" onClick={() => navigate('/register')}>
                  Đăng ký
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      <MobileDrawer />
    </AppBar>
  );
}

export default Navbar;