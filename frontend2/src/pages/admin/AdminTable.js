import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Http,
  History as HistoryIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import AlertDialog from '../../components/AlertDialog';
import TableStatusHistory from '../../components/TableStatusHistory';

function AdminTables() {
  // Định nghĩa các trạng thái có thể có của bàn
  const TABLE_STATUSES = {
    AVAILABLE: 'Trống',
    IN_USE: 'Đang sử dụng',
    RESERVED: 'Đã đặt',
    CLEANING: 'Đang dọn dẹp',
    MAINTENANCE: 'Bảo trì'
  };

  const [tables, setTables] = useState([
    { id: 1, name: 'Bàn 1', status: TABLE_STATUSES.AVAILABLE, capacity: 4 },
    { id: 2, name: 'Bàn 2', status: TABLE_STATUSES.IN_USE, capacity: 6 },
    { id: 3, name: 'Bàn 3', status: TABLE_STATUSES.AVAILABLE, capacity: 2 },
    { id: 4, name: 'Bàn 4', status: TABLE_STATUSES.RESERVED, capacity: 8 },
    { id: 5, name: 'Bàn 5', status: TABLE_STATUSES.AVAILABLE, capacity: 4 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });

  const [statusHistory, setStatusHistory] = useState({});
  const [openHistory, setOpenHistory] = useState(false);
  const [selectedTableHistory, setSelectedTableHistory] = useState(null);

  // Xử lý thêm/sửa bàn
  const handleSubmit = () => {
    if (selectedTable) {
      // Cập nhật bàn
      setTables(tables.map(table =>
        table.id === selectedTable.id
          ? { ...table, ...formData }
          : table
      ));
    } else {
      // Thêm bàn mới
      const newTable = {
        id: tables.length + 1,
        ...formData,
        status: 'Trống'
      };
      setTables([...tables, newTable]);
    }
    handleCloseDialog();
  };

  // Mở dialog thêm/sửa
  const handleOpenDialog = (table = null) => {
    setSelectedTable(table);
    setFormData(table || { name: '', capacity: '' });
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTable(null);
    setFormData({ name: '', capacity: '' });
  };

  // Xử lý xóa bàn
  const handleDelete = (table) => {
    setSelectedTable(table);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    setTables(tables.filter(table => table.id !== selectedTable.id));
    setOpenDeleteDialog(false);
    setSelectedTable(null);
  };

  // Xử lý hiển thị QR code
  const handleShowQR = (table) => {
    setSelectedTable(table);
    setOpenQRDialog(true);
  };

  // Thêm hàm xử lý thay đổi trạng thái
  const handleStatusChange = (tableId, newStatus) => {
    // Cập nhật trạng thái bàn
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, status: newStatus }
        : table
    ));

    // Thêm vào lịch sử
    const historyRecord = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      user: 'Admin', // Lấy từ context auth
      note: '' // Có thể thêm dialog để nhập ghi chú
    };

    setStatusHistory(prev => ({
      ...prev,
      [tableId]: [...(prev[tableId] || []), historyRecord]
    }));
  };

  const handleViewHistory = (table) => {
    setSelectedTableHistory(table);
    setOpenHistory(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Quản lý bàn
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm bàn
        </Button>
      </Box>

      {/* Bảng danh sách */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên bàn</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.name}</TableCell>
                <TableCell>{table.capacity} người</TableCell>
                <TableCell>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={table.status}
                      onChange={(e) => handleStatusChange(table.id, e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          color: getStatusColor(table.status),
                          fontWeight: 'medium'
                        }
                      }}
                    >
                      {Object.values(TABLE_STATUSES).map((status) => (
                        <MenuItem 
                          key={status} 
                          value={status}
                          sx={{
                            color: getStatusColor(status)
                          }}
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleShowQR(table)}
                  >
                    <QrCodeIcon />
                  </IconButton>
                  <IconButton 
                    color="info" 
                    onClick={() => handleOpenDialog(table)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(table)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewHistory(table)}
                    sx={{ ml: 1 }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog thêm/sửa bàn */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedTable ? 'Sửa thông tin bàn' : 'Thêm bàn mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên bàn"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Sức chứa"
            type="number"
            fullWidth
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTable ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog hiển thị QR code */}
      <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)}>
        <DialogTitle>Mã QR cho {selectedTable?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            {selectedTable && (
              <QRCodeSVG
                value={`http://192.168.230.29:3000/table/${selectedTable.id}/menu-mobile`}
                size={200}
                level="H"
                includeMargin
              />
            )}
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Quét mã QR để truy cập menu
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRDialog(false)}>Đóng</Button>
          <Button variant="contained" color="primary">
            Tải xuống
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog
        open={openDeleteDialog}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa ${selectedTable?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setOpenDeleteDialog(false)}
      />

      {/* Dialog lịch sử trạng thái */}
      <TableStatusHistory
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        history={statusHistory[selectedTableHistory?.id] || []}
      />
    </Box>
  );
}

// Hàm helper để lấy màu tương ứng với trạng thái
const getStatusColor = (status) => {
  switch (status) {
    case 'Trống':
      return 'success.main';
    case 'Đang sử dụng':
      return 'primary.main';
    case 'Đã đặt':
      return 'warning.main';
    case 'Đang dọn dẹp':
      return 'info.main';
    case 'Bảo trì':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

export default AdminTables;
