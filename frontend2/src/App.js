import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AlertProvider } from './contexts/AlertContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProduct';
import AdminTables from './pages/admin/AdminTable';
import CreateOrder from './pages/CreateOrder';
import ScanTable from './pages/ScanTable';
import TableMenu from './pages/TableMenu';
import TableMenuPhone from './pages/TableMenuPhone';
import TableReservation from './pages/TableReservation';
import Profile from './pages/Profile';
import './styles/App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4d4d',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

// Thêm kiểm tra feature flag cho Google Login
const enableGoogleLogin = process.env.REACT_APP_ENABLE_GOOGLE_LOGIN === 'true';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/menu" element={<MainLayout><Menu /></MainLayout>} />
            <Route path="/create-order" element={<MainLayout><CreateOrder /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/products" element={<AdminProducts />} />
                    <Route path="/tables" element={<AdminTables />} />
                  </Routes>
                </AdminRoute>
              }
            />
            <Route path="/scan" element={<ScanTable />} />
            <Route path="/table/:tableId/menu" element={<TableMenu />} />
            <Route 
              path="/table/:tableId/menu-mobile" 
              element={<TableMenuPhone />} 
            />
            <Route path="/reservation" element={<TableReservation />} />
          </Routes>
        </Router>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
