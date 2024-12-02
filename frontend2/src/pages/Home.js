import { Container, Typography, Box, Grid, Paper } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Chào mừng đến với FASTFOOD
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          Khám phá các món ăn ngon và dịch vụ giao hàng nhanh chóng
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Đặt hàng dễ dàng
            </Typography>
            <Typography>
              Chỉ với vài cú nhấp chuột, bạn có thể đặt món ăn yêu thích của mình
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Giao hàng nhanh chóng
            </Typography>
            <Typography>
              Cam kết giao hàng trong vòng 30 phút tại khu vực nội thành
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Đảm bảo chất lượng
            </Typography>
            <Typography>
              Các món ăn được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 