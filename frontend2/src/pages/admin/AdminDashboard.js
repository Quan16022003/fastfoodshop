import { Typography, Grid, Paper } from '@mui/material';

function AdminDashboard() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Bảng điều khiển
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Tổng đơn hàng</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Doanh thu</Typography>
            <Typography variant="h4">0đ</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Số người dùng</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminDashboard; 