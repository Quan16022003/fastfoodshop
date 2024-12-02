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
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAlert } from '../contexts/AlertContext';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { login, loginWithGoogle } = useAuth();
    const [formData, setFormData] = useState({
        email: 'nhq16022003@gmail.com',
        password: '123456789',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email?.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await login(formData.email, formData.password);
            if (response.roles?.includes('ROLE_USER')) {
                showAlert('success', 'Đăng nhập thành công!');
                navigate('/');
            } else {
                showAlert('error', 'Tài khoản không có quyền truy cập!');
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Đăng nhập thất bại!';
            
            // if (error.response) {
            //     switch (error.response.data?.message) {
            //         case 'User Not Found':
            //             errorMessage = 'Email không tồn tại trong hệ thống!';
            //             setErrors(prev => ({
            //                 ...prev,
            //                 email: 'Email không tồn tại trong hệ thống!'
            //             }));
            //             break;
            //         case 'Invalid Password':
            //             errorMessage = 'Mật khẩu không chính xác!';
            //             setErrors(prev => ({
            //                 ...prev,
            //                 password: 'Mật khẩu không chính xác!'
            //             }));
            //             break;
            //         case 'User is blocked':
            //             errorMessage = 'Tài khoản đã bị khóa!';
            //             break;
            //         case 'User is not verified':
            //             errorMessage = 'Tài khoản chưa được xác thực!';
            //             break;
            //         default:
            //             errorMessage = error.response.data?.message || 'Đăng nhập thất bại!';
            //     }
            //}
            
            showAlert('error', errorMessage);
            
            if (error.response?.status === 500) {
                setFormData({
                    email: '',
                    password: ''
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await loginWithGoogle(credentialResponse.credential);
            if (response.roles?.includes('ROLE_USER')) {
                showAlert('success', 'Đăng nhập thành công!');
                navigate('/');
            } else {
                showAlert('error', 'Tài khoản không có quyền truy cập!');
            }
        } catch (error) {
            showAlert('error', 'Đăng nhập bằng Google thất bại!');
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
                    Đăng nhập
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
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
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
                            'Đăng nhập'
                        )}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <MuiLink 
                            component={Link} 
                            to="/forgot-password" 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Quên mật khẩu?
                        </MuiLink>
                        <MuiLink 
                            component={Link} 
                            to="/register" 
                            variant="body2"
                            sx={{ 
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Chưa có tài khoản? Đăng ký
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>

            <Divider sx={{ my: 2 }}>Hoặc</Divider>
            
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        showAlert('error', 'Đăng nhập bằng Google thất bại!');
                    }}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="100%"
                />
            </Box>
        </Container>
    );
}

export default Login;
