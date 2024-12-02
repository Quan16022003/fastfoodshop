import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Badge,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Drawer,
  AppBar,
  Toolbar,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { menuItems, categories } from '../data/menuItems';
import { filterItems } from '../services/menuService';
import ProductDetailModal from '../components/ProductDetailModal';

function TableMenuPhone() {
  const { tableId } = useParams();
  const location = useLocation();
  const reservation = location.state?.reservation;

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (reservation) {
      console.log('Thông tin đặt bàn:', reservation);
    }
  }, [reservation]);

  const handleUpdateQuantity = (item, change) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      if (newQuantity <= 0) {
        setCart(cart.filter(i => i.id !== item.id));
      } else {
        setCart(cart.map(i =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        ));
      }
    } else if (change > 0) {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = filterItems(menuItems, selectedCategory, categories, '');

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header cố định */}
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            color="inherit"
          >
            Trang chủ
          </Button>
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Bàn {tableId}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Badge badgeContent={cartItemCount} color="error">
            <IconButton 
              color="inherit" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Badge>
        </Toolbar>

        {/* Danh mục cuộn ngang */}
        <Box 
          sx={{ 
            display: 'flex',
            overflowX: 'auto',
            px: 2,
            py: 1,
            bgcolor: 'background.paper',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {categories.map(category => (
            <Card
              key={category.id}
              sx={{ 
                minWidth: 100,
                mr: 1,
                bgcolor: selectedCategory === category.id ? 'primary.main' : 'white',
                color: selectedCategory === category.id ? 'white' : 'text.primary',
              }}
            >
              <CardActionArea 
                onClick={() => setSelectedCategory(category.id)}
                sx={{ p: 1, display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  image={category.image}
                  alt={category.name}
                  sx={{ 
                    height: 40,
                    width: 40,
                    objectFit: 'contain',
                    filter: selectedCategory === category.id ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
                <Typography 
                  variant="caption" 
                  align="center"
                  sx={{ mt: 0.5 }}
                >
                  {category.name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </AppBar>

      {/* Danh sách món ăn */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {filteredItems.map((item, index) => (
            <Grid item xs={6} key={item.id}>
              <Card>
                <CardActionArea onClick={() => setSelectedProduct(item)}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        height: '2.4em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Typography 
                        variant="body2" 
                        color="error.main"
                        fontWeight="bold"
                      >
                        {item.price.toLocaleString('vi-VN')}đ
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(item, 1);
                        }}
                        sx={{ 
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' }
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Drawer giỏ hàng */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: 400 }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6">Giỏ hàng ({cartItemCount})</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => setIsCartOpen(false)}>
                <RemoveIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {cart.map(item => (
              <Box 
                key={item.id} 
                sx={{ 
                  display: 'flex', 
                  mb: 2,
                  pb: 2,
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{ width: 60, height: 60, borderRadius: 1 }}
                />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="body2" color="error.main">
                    {item.price.toLocaleString('vi-VN')}đ
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleUpdateQuantity(item, -1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton 
                      size="small"
                      onClick={() => handleUpdateQuantity(item, 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Paper 
            elevation={3} 
            sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6" color="error.main">
                {total.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="error"
              disabled={cart.length === 0}
            >
              Đặt món
            </Button>
          </Paper>
        </Box>
      </Drawer>

      {/* Nút giỏ hàng nổi */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { sm: 'none' }
        }}
        onClick={() => setIsCartOpen(true)}
      >
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      {/* Modal chi tiết sản phẩm */}
      <ProductDetailModal
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={(product, quantity) => {
          handleUpdateQuantity(product, quantity);
        }}
      />
    </Box>
  );
}

export default TableMenuPhone;
