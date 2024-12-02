import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Divider,
  Badge,
  Paper,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { menuItems, categories } from '../data/menuItems';
import { filterItems } from '../services/menuService';
import ProductDetailModal from '../components/ProductDetailModal';

function TableMenu() {
  const { tableId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const filteredItems = filterItems(menuItems, selectedCategory, categories, searchQuery);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Menu bên trái */}
      <Box sx={{ 
        width: `calc(100% - 400px)`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        {/* Header và danh mục (fixed) */}
        <Box sx={{ 
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'white',
          zIndex: 1
        }}>
          {/* Nút Back to home */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
            >
              Back to home
            </Button>
          </Box>

          {/* Danh mục */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2,
                p: 1,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3 }
              }}
            >
              {categories.map(category => (
                <Card
                  key={category.id}
                  sx={{ 
                    width: 150,
                    bgcolor: selectedCategory === category.id ? 'primary.main' : 'white',
                    color: selectedCategory === category.id ? 'white' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => setSelectedCategory(category.id)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={category.image}
                      alt={category.name}
                      sx={{ 
                        height: 60,
                        width: '80%',
                        mt: 1,
                        objectFit: 'contain',
                        filter: selectedCategory === category.id ? 'brightness(0) invert(1)' : 'none'
                      }}
                    />
                    <CardContent 
                      sx={{ 
                        p: 1, 
                        '&:last-child': { pb: 1 },
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        variant="subtitle2"
                        align="center"
                        sx={{ 
                          fontWeight: selectedCategory === category.id ? 'bold' : 'normal'
                        }}
                      >
                        {category.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Dòng hiển thị danh mục đã chọn */}
          <Box 
            sx={{ 
              px: 2, 
              py: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'grey.50'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                fontWeight: 'medium'
              }}
            >
              {/* Icon của danh mục */}
              <Box
                component="img"
                src={categories.find(cat => cat.id === selectedCategory)?.image}
                alt=""
                sx={{ 
                  width: 24,
                  height: 24,
                  objectFit: 'contain'
                }}
              />
              {/* Tên danh mục */}
              {categories.find(cat => cat.id === selectedCategory)?.name}
              {/* Số lượng sản phẩm */}
              <Typography 
                component="span"
                variant="body2"
                sx={{ 
                  ml: 'auto',
                  color: 'text.secondary'
                }}
              >
                {filteredItems.length} sản phẩm
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Danh sách sản phẩm (scrollable) */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3 }
        }}>
          <Grid 
            container 
            spacing={2}
            columns={{ xs: 12, sm: 12, md: 15, lg: 20 }} // 3 sản phẩm trên mobile, 4 trên tablet, 5 trên desktop
          >
            {filteredItems.map((item, index) => (
              <Grid item xs={4} sm={3} md={3} lg={4} key={item.id}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => handleProductClick(item)}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          height: '2.4em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {index + 1}. {item.name}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {item.price.toLocaleString('vi-VN')}đ
                        </Typography>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateQuantity(item, 1);
                          }}
                          sx={{
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'error.dark'
                            }
                          }}
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Giỏ hàng bên phải (fixed) */}
      <Paper 
        elevation={3}
        sx={{ 
          width: 400,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: 1,
          borderColor: 'divider',
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 2
        }}
      >
        {/* Header giỏ hàng */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'white'
        }}>
          <Typography variant="h6">
            Giỏ hàng ({cart.length})
          </Typography>
        </Box>

        {/* Danh sách món trong giỏ (scrollable) */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 3 }
        }}>
          {cart.map(item => (
            <Box 
              key={item.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
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
                sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.price.toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => handleUpdateQuantity(item, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleUpdateQuantity(item, 1)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer giỏ hàng (fixed) */}
        <Box sx={{ 
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'white'
        }}>
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
            Thanh toán
          </Button>
        </Box>
      </Paper>

      <ProductDetailModal
        open={Boolean(selectedProduct)}
        onClose={handleCloseModal}
        product={selectedProduct}
        onAddToCart={(product, quantity) => {
          handleUpdateQuantity(product, quantity);
        }}
      />
    </Box>
  );
}

export default TableMenu; 