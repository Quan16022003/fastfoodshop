import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Dữ liệu mẫu cho menu
const menuItems = [
  {
    id: 1,
    name: 'Burger Bò Phô Mai',
    description: 'Burger bò với phô mai Cheddar, rau xà lách và sốt đặc biệt',
    price: 59000,
    image: 'https://placehold.co/300x200',
    category: 'burger'
  },
  {
    id: 2,
    name: 'Pizza Hải Sản',
    description: 'Pizza với tôm, mực, sò điệp và phô mai Mozzarella',
    price: 159000,
    image: 'https://placehold.co/300x200',
    category: 'pizza'
  },
  {
    id: 3,
    name: 'Coca Cola',
    description: 'Nước giải khát có ga',
    price: 15000,
    image: 'https://placehold.co/300x200',
    category: 'drink'
  },
  {
    id: 4,
    name: 'Burger Gà',
    description: 'Burger với thịt gà giòn, rau xà lách và sốt mayonnaise',
    price: 49000,
    image: 'https://placehold.co/300x200',
    category: 'burger'
  },
  {
    id: 5,
    name: 'Pizza Rau Củ',
    description: 'Pizza chay với các loại rau củ tươi ngon',
    price: 129000,
    image: 'https://placehold.co/300x200',
    category: 'pizza'
  },
  {
    id: 6,
    name: 'Pepsi',
    description: 'Nước giải khát có ga',
    price: 15000,
    image: 'https://placehold.co/300x200',
    category: 'drink'
  }
];

// Component chính
function CreateOrder() {
  const [orderType, setOrderType] = useState('store'); // store hoặc online
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '', // chỉ dùng cho online
    note: ''
  });

  // Xử lý chuyển đổi tab
  const handleChangeTab = (event, newValue) => {
    setOrderType(newValue);
    // Reset giỏ hàng và thông tin khách khi chuyển tab
    setCart([]);
    setCustomerInfo({
      name: '',
      phone: '',
      address: '',
      note: ''
    });
    setTableNumber('');
  };

  // Thêm sản phẩm vào giỏ
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Xóa sản phẩm khỏi giỏ
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Giao diện đặt tại cửa hàng
  const StoreOrderView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Số bàn"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={customerInfo.note}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm món ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Danh mục"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="burger">Burger</MenuItem>
                    <MenuItem value="pizza">Pizza</MenuItem>
                    <MenuItem value="drink">Đồ uống</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên món</TableCell>
                  <TableCell align="right">Giá</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => {
                  const cartItem = cart.find(i => i.id === item.id);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        {item.price.toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            disabled={quantity === 0}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleAddToCart(item)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {(item.price * quantity).toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFromCart(item.id)}
                          disabled={quantity === 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Tổng tiền: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN')}đ
            </Typography>
            <Button
              variant="contained"
              size="large"
              disabled={cart.length === 0 || !tableNumber}
              onClick={() => {/* Xử lý đặt món */}}
            >
              Đặt món
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  // Giao diện đặt online
  const OnlineOrderView = () => (
    <Grid container spacing={3}>
      {/* Giữ nguyên code cũ cho phần đặt online */}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tạo đơn hàng mới
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={orderType} onChange={handleChangeTab}>
          <Tab label="Đặt tại cửa hàng" value="store" />
          <Tab label="Đặt hàng online" value="online" />
        </Tabs>
      </Box>

      {orderType === 'store' ? <StoreOrderView /> : <OnlineOrderView />}
    </Container>
  );
}

export default CreateOrder;