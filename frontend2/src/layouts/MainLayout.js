import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 FASTFOOD. Tất cả các quyền được bảo lưu.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout; 