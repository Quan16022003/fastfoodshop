import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAlert } from '../../contexts/AlertContext';
import { styled } from '@mui/material/styles';
import AlertDialog from '../../components/AlertDialog';

// Dữ liệu mẫu cho danh mục
const categories = [
  'Burger',
  'Pizza', 
  'Mì Ý',
  'Gà rán',
  'Đồ uống',
  'Tráng miệng'
];

// Thêm component styled cho nút upload
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

function AdminProducts() {
  const { showAlert } = useAlert();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Burger Bò Phô Mai',
      description: 'Burger bò với phô mai Cheddar, rau xà lách và sốt đặc biệt',
      price: 59000,
      image: 'https://placehold.co/300x200',
      category: 'Burger'
    },
    // Thêm sản phẩm mẫu khác
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });

  // Thêm state để lưu file preview
  const [imagePreview, setImagePreview] = useState(null);

  // Thêm state cho confirm dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    try {
      if (selectedProduct) {
        // Cập nhật sản phẩm
        const updatedProducts = products.map(p => 
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        );
        setProducts(updatedProducts);
        showAlert('success', 'Cập nhật sản phẩm thành công!');
      } else {
        // Thêm sản phẩm mới
        const newProduct = {
          id: products.length + 1,
          ...formData
        };
        setProducts([...products, newProduct]);
        showAlert('success', 'Thêm sản phẩm thành công!');
      }
      handleCloseDialog();
    } catch (error) {
      showAlert('error', 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setOpenConfirmDialog(true);
  };

  // Thêm hàm xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    try {
      const filteredProducts = products.filter(p => p.id !== productToDelete);
      setProducts(filteredProducts);
      showAlert('success', 'Xóa sản phẩm thành công!');
    } catch (error) {
      showAlert('error', 'Có lỗi xảy ra khi xóa sản phẩm!');
    }
    setOpenConfirmDialog(false);
    setProductToDelete(null);
  };

  // Thêm hàm hủy xóa
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false);
    setProductToDelete(null);
  };

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenDialog(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Giá"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Tải ảnh lên
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
              
              {(imagePreview || formData.image) && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={imagePreview || formData.image} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProduct ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thêm Dialog xác nhận xóa */}
      <AlertDialog
        open={openConfirmDialog}
        title="Xác nhận xóa sản phẩm"
        content="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        confirmButtonProps={{ color: 'error' }}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Container>
  );
}

export default AdminProducts;