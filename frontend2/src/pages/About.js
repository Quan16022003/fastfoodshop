import { Container, Typography, Box, Paper, Grid } from '@mui/material';

function About() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Về chúng tôi
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="body1" paragraph>
            FASTFOOD là chuỗi cửa hàng thức ăn nhanh hàng đầu, chuyên cung cấp các món ăn ngon với chất lượng cao và dịch vụ chuyên nghiệp.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Sứ mệnh
            </Typography>
            <Typography variant="body1" paragraph>
              Mang đến trải nghiệm ẩm thực tuyệt vời với giá cả hợp lý cho mọi khách hàng.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Tầm nhìn
            </Typography>
            <Typography variant="body1" paragraph>
              Trở thành thương hiệu thức ăn nhanh số 1 tại Việt Nam về chất lượng và dịch vụ.
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Giá trị cốt lõi
          </Typography>
          <Typography variant="body1" component="ul">
            <li>Chất lượng là ưu tiên hàng đầu</li>
            <li>Dịch vụ khách hàng xuất sắc</li>
            <li>Đổi mới và sáng tạo liên tục</li>
            <li>Trách nhiệm với cộng đồng</li>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default About; 