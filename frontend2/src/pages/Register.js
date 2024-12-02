import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Link as MuiLink,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fullName?.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showAlert('error', 'Vui lòng kiểm tra lại thông tin!');
            return;
        }

        setIsLoading(true);
        showAlert('info', 'Đang xử lý đăng ký...');
        
        try {
            await register(
                formData.email, 
                formData.password, 
                formData.confirmPassword, 
                formData.fullName
            );
            showAlert('success', 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            let errorMessage = 'Đăng ký thất bại!';
            if (error.message === 'Email already exists') {
                errorMessage = 'Email đã tồn tại trong hệ thống!';
            }
            showAlert('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    mt: 8, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 2
                }}
            >
                <Typography 
                    component="h1" 
                    variant="h4" 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 'bold',
                        color: 'primary.main' 
                    }}
                >
                    Đăng ký
                </Typography>

                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ width: '100%' }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fullName"
                        label="Họ và tên"
                        name="fullName"
                        autoComplete="name"
                        autoFocus
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        disabled={isLoading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            height: 48,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            position: 'relative'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'primary.light',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        ) : (
                            'Đăng ký'
                        )}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <MuiLink 
                            component={Link} 
                            to="/login" 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Đã có tài khoản? Đăng nhập
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default Register;