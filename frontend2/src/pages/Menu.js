import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Dữ liệu mẫu cho danh mục
const categories = [
  'Tất cả',
  'Burger',
  'Pizza',
  'Mì Ý',
  'Gà rán',
  'Đồ uống',
  'Tráng miệng'
];

// Dữ liệu mẫu cho menu
const menuItems = [
  {
    id: 1,
    name: 'Burger Bò Phô Mai',
    description: 'Burger bò với phô mai Cheddar, rau xà lách và sốt đặc biệt',
    price: 59000,
    image: 'https://placehold.co/300x200',
    category: 'Burger'
  },
  {
    id: 2,
    name: 'Pizza Hải Sản',
    description: 'Pizza với tôm, mực, sò điệp và phô mai Mozzarella',
    price: 159000,
    image: 'https://placehold.co/300x200',
    category: 'Pizza'
  },
  // Thêm các món ăn khác ở đây
];

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Lọc và sắp xếp món ăn
  const filteredItems = menuItems
    .filter(item => 
      (selectedCategory === 'Tất cả' || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Tiêu đề */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Thực đơn
      </Typography>

      {/* Thanh tìm kiếm và lọc */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm món ăn"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp theo"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                <MenuItem value="name-asc">Tên A-Z</MenuItem>
                <MenuItem value="name-desc">Tên Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Danh mục */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>

      {/* Danh sách món ăn */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {item.price.toLocaleString('vi-VN')}đ
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                >
                  Thêm vào giỏ
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Menu;
