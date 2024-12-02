import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  EventSeat as TableIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

function TableReservation() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reservationData, setReservationData] = useState({
    customerName: '',
    phoneNumber: '',
    numberOfGuests: '',
    dateTime: dayjs(),
    note: '',
  });
  const [errors, setErrors] = useState({});

  // Giả lập dữ liệu bàn - sau này sẽ lấy từ API
  useEffect(() => {
    setTables([
      { id: 1, name: 'Bàn 1', capacity: 4, status: 'Trống' },
      { id: 2, name: 'Bàn 2', capacity: 6, status: 'Đang sử dụng' },
      { id: 3, name: 'Bàn 3', capacity: 2, status: 'Trống' },
      { id: 4, name: 'Bàn 4', capacity: 8, status: 'Đã đặt' },
      { id: 5, name: 'Bàn 5', capacity: 4, status: 'Trống' },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Trống':
        return 'success';
      case 'Đang sử dụng':
        return 'error';
      case 'Đã đặt':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleTableSelect = (table) => {
    if (table.status === 'Trống') {
      setSelectedTable(table);
      setOpenDialog(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!reservationData.customerName) {
      newErrors.customerName = 'Vui lòng nhập họ tên';
    }
    if (!reservationData.phoneNumber) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(reservationData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!reservationData.numberOfGuests) {
      newErrors.numberOfGuests = 'Vui lòng nhập số người';
    } else if (parseInt(reservationData.numberOfGuests) > selectedTable?.capacity) {
      newErrors.numberOfGuests = `Số người không được vượt quá ${selectedTable.capacity}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReservation = () => {
    if (validateForm()) {
      // Gọi API đặt bàn
      console.log('Đặt bàn:', { table: selectedTable, ...reservationData });
      
      // Chuyển đến trang menu để đặt món
      navigate(`/table/${selectedTable.id}/menu-mobile`, {
        state: { reservation: { table: selectedTable, ...reservationData } }
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Đặt bàn
      </Typography>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.id}>
            <Card 
              sx={{ 
                cursor: table.status === 'Trống' ? 'pointer' : 'default',
                opacity: table.status === 'Trống' ? 1 : 0.7
              }}
              onClick={() => handleTableSelect(table)}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                      {table.name}
                    </Typography>
                    <Chip
                      label={table.status}
                      color={getStatusColor(table.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon color="action" />
                    <Typography variant="body2">
                      Sức chứa: {table.capacity} người
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog đặt bàn */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Đặt {selectedTable?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Họ tên"
              fullWidth
              value={reservationData.customerName}
              onChange={(e) => setReservationData({ ...reservationData, customerName: e.target.value })}
              error={!!errors.customerName}
              helperText={errors.customerName}
            />

            <TextField
              label="Số điện thoại"
              fullWidth
              value={reservationData.phoneNumber}
              onChange={(e) => setReservationData({ ...reservationData, phoneNumber: e.target.value })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />

            <TextField
              label="Số người"
              type="number"
              fullWidth
              value={reservationData.numberOfGuests}
              onChange={(e) => setReservationData({ ...reservationData, numberOfGuests: e.target.value })}
              error={!!errors.numberOfGuests}
              helperText={errors.numberOfGuests}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Thời gian"
                value={reservationData.dateTime}
                onChange={(newValue) => setReservationData({ ...reservationData, dateTime: newValue })}
                minDateTime={dayjs()}
                format="DD/MM/YYYY HH:mm"
              />
            </LocalizationProvider>

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              fullWidth
              value={reservationData.note}
              onChange={(e) => setReservationData({ ...reservationData, note: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleReservation}>
            Tiếp tục đặt món
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableReservation; 