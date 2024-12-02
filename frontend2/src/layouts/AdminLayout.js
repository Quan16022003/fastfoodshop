import { Box, Container } from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';

function AdminLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminLayout; 