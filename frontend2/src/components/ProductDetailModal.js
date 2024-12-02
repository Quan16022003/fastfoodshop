import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Paper,
  Rating,
  DialogTitle
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer as LocalOfferIcon,
  Timer as TimerIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon
} from '@mui/icons-material';

function ProductDetailModal({ open, onClose, product, onAddToCart }) {
  const [quantity, setQuantity] = React.useState(1);

  const handleUpdateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          maxWidth: '800px',
          m: { xs: 0, sm: 2 },
          height: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ 
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Thêm vào giỏ hàng
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* Hình ảnh sản phẩm */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={0}
              sx={{
                minHeight: { xs: 250, sm: 300, md: 400 },
                p: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: { xs: '100%', sm: '80%' },
                  height: 'auto',
                  objectFit: 'contain',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              {/* Badge đánh giá */}
              <Paper
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <StarIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight="bold">4.5</Typography>
              </Paper>
            </Paper>
          </Grid>

          {/* Thông tin sản phẩm */}
          <Grid item xs={12} md={7}>
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              bgcolor: 'white'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'text.primary'
                }}
              >
                {product.name}
              </Typography>

              <Typography 
                variant="h4" 
                color="error" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                {product.price.toLocaleString('vi-VN')}đ
              </Typography>

              <Typography 
                variant="body1"
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  lineHeight: 1.8
                }}
              >
                {product.description}
              </Typography>

              {/* Thông tin thêm - style mới */}
              <Box 
                sx={{ 
                  mb: { xs: 2, sm: 3, md: 4 },
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: 'grey.50',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalOfferIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography>Giảm 10% cho đơn hàng đầu tiên</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ color: 'info.main', mr: 1 }} />
                  <Typography>Thời gian chuẩn bị: 15-20 phút</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShippingIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>Miễn phí giao hàng trong bán kính 3km</Typography>
                </Box>
              </Box>

              {/* Số lượng */}
              <Box sx={{ 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 3 },
                mb: { xs: 2, sm: 3, md: 4 }
              }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Số lượng:
                </Typography>
                <Paper 
                  elevation={0}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    px: 1
                  }}
                >
                  <IconButton 
                    onClick={() => handleUpdateQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography 
                    sx={{ 
                      minWidth: 50, 
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => handleUpdateQuantity(1)}>
                    <AddIcon />
                  </IconButton>
                </Paper>
              </Box>

              {/* Nút thêm vào giỏ */}
              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ 
                  py: { xs: 1, sm: 1.5 },
                  position: { xs: 'sticky', sm: 'static' },
                  bottom: { xs: 1, sm: 'auto' },
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: 2
                }}
              >
                {(product.price * quantity).toLocaleString('vi-VN')}đ
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailModal; 